export enum FrequencyStatus {
  PRESENTE = "PRESENTE",
  AUSENTE = "AUSENTE"
}

export interface FrequencyProps {
  id: number;
  studentId: number;
  classId: number | null;
  date: Date;
  status: FrequencyStatus;
  notes: string | null;
}


export class Frequency {
    private readonly id: number;
    private readonly studentId: number;
    private readonly classId: number | null;
    private date:   Date;
    private status: FrequencyStatus;
    private notes: string | null;

    private constructor(props: FrequencyProps) {
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

    public getId(): number { return this.id; }
    
    public getStudentId(): number { return this.studentId; }
    
    public getClassId(): number | null { return this.classId; }
    
    public getDate(): Date { return this.date; }
    
    public getStatus(): FrequencyStatus { return this.status; }
    
    public getNotes(): string | null { return this.notes; }
    
    public setDate(newDate: Date): void {
        this.date = newDate;
    }
    
    public setNotes(newNotes: string | null): void {
        this.notes = newNotes ? newNotes.trim() : null;
    }

    public markPresent(): void {
        this.status = FrequencyStatus.PRESENTE;
        this.notes = null;
    }

    public markAbsent(notes?: string): void {
        this.status = FrequencyStatus.AUSENTE;
        this.notes = notes?.trim() ?? null;
    }
}