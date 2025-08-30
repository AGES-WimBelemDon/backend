import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import * as admin from "firebase-admin";
import { FIREBASE_ADMIN } from "src/modules/firebase/firebase.config.module";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(@Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const token: string | undefined = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Authorization token not found.");
    }

    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      request["user"] = decodedToken;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired authorization token.");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const auth: string|undefined = request.headers.authorization;
    if (!auth) {
        return undefined;
    };
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return undefined;
    };    
    return parts[1];
  }
}