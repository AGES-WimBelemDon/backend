import { UnauthorizedException } from '@nestjs/common';

export enum AuthErrorCode {
  INVALID_TOKEN = 'INVALID_TOKEN',
  USER_NOT_REGISTERED = 'USER_NOT_REGISTERED',
  USER_INACTIVE = 'USER_INACTIVE',
}

export class AuthException extends UnauthorizedException {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
  ) {
    super({
      statusCode: 401,
      message,
      code,
      timestamp: new Date().toISOString(),
    });
  }
}
