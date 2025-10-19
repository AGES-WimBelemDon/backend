import { FormType } from "src/common/enums/domain.enums";
import { Answer } from "../domain/answer.entity";
import { Form } from "../domain/form.entity";
import { Question } from "../domain/question.entity";
export const ASSESSMENT_REPOSITORY_TOKEN = "IAssessmentRepository";
export interface IAssessmentRepository {
  findAllForms(): Promise<Form[]>;
  findQuestionsByFormType(formType: FormType): Promise<Question[]>;
  createAnswers(answers: Answer[]): Promise<Answer[]>;
  findQuestionsByIds(questionsIds: number[]): Promise<Question[]>;
  findAnswersByQuestionsIdsAndStudentId(
    questionsId: number[], 
    studentId: number
  ): Promise<Answer[]>;
  findAnswersByIds(answersId: number[]): Promise<Answer[]>;
  removeAnswersByIds(answersIds: number[]): Promise<void>;
  updateAnswers(answers: Answer[]): Promise<Answer[]>;
  findAnswersByStudentAndFormType(
    studentId: number, 
    formType: FormType
  ): Promise<Answer[]>;
  updateAnswerContent(
    answerId: number, 
    content: string
  ): Promise<Answer | null>;
}