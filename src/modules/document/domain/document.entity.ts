import { FileStatus } from "src/common/enums/domain.enums";
import { Student } from "src/modules/student/domain/student.entity";

export interface DocumentProps {
  id: string;
  studentId: number;
  originalName: string;
  storagePath: string;
  contentType: string;
  description?: string;
  createdAt?: Date;
  student?: Student;
  status?: FileStatus;
}

export class Document {
  private id: string;
  private studentId: number;
  private originalName: string;
  private storagePath: string;
  private contentType: string;
  private description?: string;
  private createdAt: Date;
  private student?: Student;
  private status?: FileStatus;

  constructor(props: DocumentProps) {
    this.id = props.id;
    this.studentId = props.studentId;
    this.originalName = props.originalName;
    this.storagePath = props.storagePath;
    this.contentType = props.contentType;
    this.description = props.description;
    this.createdAt = props.createdAt ?? new Date();
    this.student = props.student;
    this.status = props.status ?? FileStatus.PENDING;
  }
  getId(): string {
    return this.id;
  }

  getStudentId(): number {
    return this.studentId;
  }

  getOriginalName(): string {
    return this.originalName;
  }

  getStoragePath(): string {
    return this.storagePath;
  }

  getContentType(): string {
    return this.contentType;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getStudent(): Student | undefined {
    return this.student;
  }

  getStatus(): FileStatus | undefined {
    return this.status;
  }

  setId(id: string): void {
    this.id = id;
  }

  setStudentId(studentId: number): void {
    this.studentId = studentId;
  }

  setOriginalName(originalName: string): void {
    this.originalName = originalName;
  }

  setStoragePath(storagePath: string): void {
    this.storagePath = storagePath;
  }

  setContentType(contentType: string): void {
    this.contentType = contentType;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  setStudent(student: Student): void {
    this.student = student;
  }
  setStatus(status: FileStatus): void {
    this.status = status;
  }
}