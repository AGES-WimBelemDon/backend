import { DayOfWeek } from "src/common/enums/domain.enums";

export class ClassSchedule {
  id: number;
  classId: number;
  daysOfWeek: DayOfWeek;
  constructor(
    id: number,
    classId: number,
    daysOfWeek: DayOfWeek,
  ) {
    this.id = id;
    this.classId = classId;
    this.daysOfWeek = daysOfWeek;
  }
}