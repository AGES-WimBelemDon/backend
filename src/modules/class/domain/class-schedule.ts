import { DayOfWeek } from "src/common/enums/domain.enums";
interface ClassScheduleProps{
  id?: number,
  classId?: number,
  dayOfWeek: DayOfWeek
} 
export class ClassSchedule {
  id?: number;
  classId?: number;
  daysOfWeek: DayOfWeek;
  constructor(props: ClassScheduleProps) {
    this.daysOfWeek = props.dayOfWeek;
    this.id = props.id;
    this.classId = props.classId;
  }
}