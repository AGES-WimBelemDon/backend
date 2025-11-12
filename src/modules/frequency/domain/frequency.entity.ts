import { FrequencyStatus, NoteTypes } from "src/common/enums/domain.enums";

export interface FrequencyProps {
  id: number | null;
  studentId: number;
  classId: number | null;
  date: Date;
  status: FrequencyStatus;
  notes: NoteTypes | null;
}

export class Frequency {
  private readonly id: number | null;
  private readonly studentId: number;
  private readonly classId: number | null;
  private date: Date;
  private status: FrequencyStatus;
  private notes: NoteTypes | null;

  public constructor(props: FrequencyProps) {
    if (!props.studentId || !props.date) {
      throw new Error("Frequency requires a studentId and a date.");
    }

    this.id = props.id;
    this.studentId = props.studentId;
    this.classId = props.classId;
    this.date = props.date;
    this.status = props.status;
    this.notes = props.notes;
  }

  public getId(): number | null {
    return this.id;
  }

  public getStudentId(): number {
    return this.studentId;
  }

  public getClassId(): number | null {
    return this.classId;
  }

  public getDate(): Date {
    return this.date;
  }

  public getStatus(): FrequencyStatus {
    return this.status;
  }

  public getNotes(): NoteTypes | null {
    return this.notes;
  }

  public setDate(newDate: Date): void {
    this.date = newDate;
  }

  public setNotes(newNotes: NoteTypes | null): void {
    this.notes = newNotes;
  }

  public markPresent(): void {
    this.status = FrequencyStatus.PRESENTE;
    this.notes = null;
  }

  public markAbsent(notes?: NoteTypes): void {
    this.status = FrequencyStatus.AUSENTE;
    this.notes = notes ?? null;
  }
}
