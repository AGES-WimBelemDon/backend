import { Role } from "@prisma/client";

export const ALL_ROLES = [
  Role.admin,
  Role.manager,
  Role.teacher,
  Role.psychologist,
  Role.intern,
  Role.developer,
] as const;
