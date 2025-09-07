export interface UserClassesDTO {
  classId: number | null;
  className: string | null;
  classState: string;
  levelName: string | null;
  isGeral: boolean;
  activity: {
    activityId: number | null;
    activityName: string;
  };
}

export interface GetMyClassesDTO{
    classes : UserClassesDTO[]
}