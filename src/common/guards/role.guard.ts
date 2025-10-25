import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length || requiredRoles.includes(Role.Any)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    
    const userRole = request['user']?.role as Role;

    if (!userRole) {
      return false;
    }

    if (process.env.NODE_ENV === 'development' && userRole === Role.Developer) {
      return true;
    }

    const hasAnyValidRole = requiredRoles.some((role) => userRole === role);

    if (!hasAnyValidRole) {
      throw new Error(`Expected one of roles [${requiredRoles.join(', ')}], but user has role ${userRole}`);
    }

    return true;
  }
}
