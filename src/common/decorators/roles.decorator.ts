import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

export const STAFF_ROLES = [
  Role.admin,
  Role.manager,
  Role.psychologist,
  Role.social_worker,
  Role.teacher,
] as const;

export const INTERN_ROLES = [
  Role.psychology_intern,
  Role.social_work_intern,
] as const;

export const ALL_ROLES = [...STAFF_ROLES, ...INTERN_ROLES] as const;

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
