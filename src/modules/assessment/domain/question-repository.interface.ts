import { Question } from "./question.entity";


export interface QuestionRepository {
  findByFormId(formId: number): Promise<Question[]>;
  findById(id: number): Promise<Question | null>;
}

