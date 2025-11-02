import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { RequestWithDbUser } from 'src/common/interfaces/request.interface';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const targets = [context.getHandler(), context.getClass()];
    
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets);
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, targets);

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithDbUser>();
      
    const userRole = request.user?.role;

    if (!userRole) {
      return false;
    }

    if (process.env.NODE_ENV === 'development' && userRole === Role.developer) {
      return true;
    }

    const hasAnyValidRole = requiredRoles.some((role) => userRole === role);

    if (!hasAnyValidRole) {
      throw new ForbiddenException(`Expected one of roles [${requiredRoles.join(', ')}], but user has role ${userRole}`);
    }

    return true;
  }
}
