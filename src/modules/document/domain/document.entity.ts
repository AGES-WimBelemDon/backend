import { Student } from "src/modules/student/domain/student.entity";

export interface DocumentProps {
  id?: string;
  studentId: number;
  originalName: string;
  storagePath: string;
  contentType: string;
  description: string;
  createdAt?: Date;
  student?: Student;
}

export class Document {
  private id?: string;
  private studentId: number;
  private originalName: string;
  private storagePath: string;
  private contentType: string;
  private description: string;
  private createdAt: Date;
  private student?: Student;

  constructor(props: DocumentProps) {
    this.id = props.id;
    this.studentId = props.studentId;
    this.originalName = props.originalName;
    this.storagePath = props.storagePath;
    this.contentType = props.contentType;
    this.description = props.description;
    this.createdAt = props.createdAt ?? new Date();
    this.student = props.student;
  }
  getId(): string | undefined {
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

  getDescription(): string {
    return this.description;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getStudent(): Student | undefined {
    return this.student;
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
}