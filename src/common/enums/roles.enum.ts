import { Role } from "@prisma/client";

export const ALL_ROLES = [
  Role.admin,
  Role.manager,
  Role.teacher,
  Role.psychologist,
  Role.psychology_intern,
  Role.social_worker,
  Role.social_work_intern,
] as const;
