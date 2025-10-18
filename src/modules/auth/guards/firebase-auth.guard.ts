import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { UserStatus } from "@prisma/client";
import { Request } from "express";
import * as admin from "firebase-admin";
import { FIREBASE_ADMIN } from "src/modules/firebase/firebase.config.module";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Authorization token not found");
    }

    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);

      const dbUser = await this.prisma.user.findUnique({
        where: { uidFirebase: decodedToken.uid },
        select: { id: true, role: true, status: true, email: true },
      });

      if (!dbUser) {
        throw new ForbiddenException("User not registered in system");
      }

      if (dbUser.status !== UserStatus.ATIVO) {
        throw new ForbiddenException("User account is disabled");
      }

      request["user"] = { ...decodedToken, ...dbUser };
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        "Invalid or expired authorization token: " + error,
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const auth = request.headers.authorization;
    if (!auth) {
      return undefined;
    }
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return undefined;
    }
    return parts[1];
  }
}
