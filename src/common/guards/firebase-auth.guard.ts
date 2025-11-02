import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { Request } from "express";
import { RequestWithFirebase } from "src/common/interfaces/request.interface";
import * as admin from "firebase-admin";
import { FIREBASE_ADMIN } from "src/modules/firebase/firebase.config.module";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets);
    if (isPublic) {
      return true;
    }

  const request = context.switchToHttp().getRequest<RequestWithFirebase>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Authorization token not found");
    }

    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      request.firebaseToken = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      };
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
