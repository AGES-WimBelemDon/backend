import { ClassSchedule } from "./class-schedule";
import { Teacher } from "./teacher";

interface ClassProps {
  name: string;
  activityId: number;
  levelId: number;
  state: string;
  teachers?: Teacher[];
  id?: number;
  isRecurrent: boolean;
  startDate: Date;
  endDate?: Date;
  startTime: Date;
  endTime: Date;
  schedules: ClassSchedule[];
}

export class Class {
  id?: number;
  name: string;
  activityId: number;
  levelId: number;
  state: string;
  teachers: Teacher[];
  isRecurrent: boolean;
  startDate: Date;
  endDate?: Date;
  startTime: Date;
  endTime: Date;
  schedules: ClassSchedule[];

  constructor(props: ClassProps) {
    this.id = props.id;
    this.name = props.name;
    this.activityId = props.activityId;
    this.levelId = props.levelId;
    this.state = props.state;
    this.teachers = props.teachers || [];
    this.isRecurrent = props.isRecurrent;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.schedules = props.schedules;
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

  getTeachers(): Teacher[] {
    return this.teachers;
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

  getSchedules(): ClassSchedule[] {
    return this.schedules;
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

  setTeachers(teachers: Teacher[]): void {
    this.teachers = teachers;
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

  setSchedules(schedules: ClassSchedule[]): void {
    this.schedules = schedules;
  }
}
