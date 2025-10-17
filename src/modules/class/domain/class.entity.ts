interface ClassProps {
  name: string;
  activityId: number;
  levelId: number;
  state: string;
  teacherIds?: number[];
  id?: number;
  isRecurrent: boolean;
  startDate: Date;
  endDate?: Date;
  startTime: Date;
  endTime: Date;
  schedulesIds: number[];
}

export class Class {
  id?: number;
  name: string;
  activityId: number;
  levelId: number;
  state: string;
  teacherIds: number[];
  isRecurrent: boolean;
  startDate: Date;
  endDate?: Date;
  startTime: Date;
  endTime: Date;
  schedulesIds: number[];

  constructor(props: ClassProps) {
    this.id = props.id;
    this.name = props.name;
    this.activityId = props.activityId;
    this.levelId = props.levelId;
    this.state = props.state;
    this.teacherIds = props.teacherIds || [];
    this.isRecurrent = props.isRecurrent;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.schedulesIds = props.schedulesIds;
  }

  getId(): number | undefined {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getActivityId(): number {
    return this.activityId;
  }

  getLevelId(): number {
    return this.levelId;
  }

  getState(): string {
    return this.state;
  }


  getTeacherIds(): number[] {
    return this.teacherIds;
  }

  getIsRecurrent(): boolean {
    return this.isRecurrent;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date | null {
    return this.endDate ?? null;
  }

  getStartTime(): Date {
    return this.startTime;
  }

  getEndTime(): Date {
    return this.endTime;
  }

  getSchedulesIds(): number[] {
    return this.schedulesIds;
  }

  setName(name: string): void {
    this.name = name;
  }

  setActivityId(activityId: number): void {
    this.activityId = activityId;
  }

  setLevelId(levelId: number): void {
    this.levelId = levelId;
  }

  setState(state: string): void {
    this.state = state;
  }

  setTeacherIds(teacherIds: number[]): void {
    this.teacherIds = teacherIds;
  }

  setIsRecurrent(isRecurrent: boolean): void {
    this.isRecurrent = isRecurrent;
  }

  setStartDate(startDate: Date): void {
    this.startDate = startDate;
  }

  setEndDate(endDate?: Date): void {
    this.endDate = endDate;
  }

  setStartTime(startTime: Date): void {
    this.startTime = startTime;
  }

  setEndTime(endTime: Date): void {
    this.endTime = endTime;
  }

  setSchedulesIds(schedulesIds: number[]): void {
    this.schedulesIds = schedulesIds;
  }
}
