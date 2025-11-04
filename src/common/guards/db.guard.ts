import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestUserPayload, RequestWithDbUser } from 'src/common/interfaces/request.interface';
import { Role, UserStatus } from '@prisma/client';
import { DEV_CONFIG, DevConfigType } from 'src/config/dev.config.module';

@Injectable()
export class DbGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
    @Inject(DEV_CONFIG) private readonly devConfig: DevConfigType,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithDbUser>();

    const firebaseToken = request.firebaseToken;
    if (!firebaseToken?.uid) {
      return false;
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { uidFirebase: firebaseToken.uid },
      select: { id: true, role: true, status: true },
    });

    if (!dbUser) {
      throw new ForbiddenException('User not registered in system');
    }

    if (dbUser.status !== UserStatus.ATIVO) {
      throw new ForbiddenException('User account is disabled');
    }

    request.user = dbUser as RequestUserPayload;

    if (this.devConfig?.enabled) {
      request.user.role = (this.devConfig.role as Role) || Role.teacher;
    }

    return true;
  }
}
