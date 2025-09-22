export class ActivityDTO {
  id: number;
  name: string;
}

export class LevelDTO {
  id: number;
  name: string;
}

export class PersonDTO {
  id: number;
  fullName: string;
}

export class ClassDetailedDTO {
  id: number;
  name: string;
  state: string;
  activity: ActivityDTO;
  level: LevelDTO;
  students: PersonDTO[];
  teachers: PersonDTO[];
}

export class ClassDetailedResponseDTO {
  turmas: ClassDetailedDTO[];
}
