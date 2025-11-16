import { ALL_ROLES, INTERN_ROLES, Roles, STAFF_ROLES } from './roles.decorator';
import { Role } from '@prisma/client';

export const StaffOnly = () => Roles(...STAFF_ROLES);
export const InternsOnly = () => Roles(...INTERN_ROLES);
export const StaffAndInterns = () => Roles(...ALL_ROLES);

export const AdminOnly = () => Roles(Role.admin);
export const AdminAndManager = () => Roles(Role.admin, Role.manager);