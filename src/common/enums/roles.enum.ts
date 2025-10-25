export enum Role {
  Any = 'any',
  Admin = 'admin',
  Manager = 'manager',
  Teacher = 'teacher',
  Psychologist = 'psychologist',
  Intern = 'intern',
  Developer = 'developer',
}

export const ALL_ROLES = [
  Role.Any,
  Role.Admin,
  Role.Manager,
  Role.Teacher,
  Role.Psychologist,
  Role.Intern,
  Role.Developer,
] as const;
