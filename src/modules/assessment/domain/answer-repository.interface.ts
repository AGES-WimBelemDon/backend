import { Answer } from "./answer.entity";

export interface AnswerRepository {
  findByStudentId(studentId: number, formType?: string): Promise<Answer[]>;
  findBySubmissionDate(studentId: number, submission_date: Date): Promise<Answer[]>;
  createMany(answers: Answer[]): Promise<void>;
  updateContent(answerId: number, submission_date: Date, content: string): Promise<Answer | null>;
}

