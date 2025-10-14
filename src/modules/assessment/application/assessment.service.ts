import { Injectable,
         Inject,
         NotFoundException,
         BadRequestException
        } from "@nestjs/common";
import { AssessmentRepository } from "../infrastructure/assessment.repository";
import { CreateAssessmentDto } from "./create-assessment.dto";
import { UpdateAnswerDto } from "./update-answer.dto";
import { Form} from "../domain/form.entity";
import { FormType } from "src/common/enums/domain.enums";
import { Answer } from "../domain/answer.entity";
import { Question } from "../domain/question.entity";

@Injectable()
export class AssessmentService {
  @Inject(AssessmentRepository)
  private readonly assessmentRepository: AssessmentRepository;

  async getAllForms(): Promise<Form[]> {
    return await this.assessmentRepository.findAllForms();
  }

  async getQuestionsByFormType(formType: string): Promise<Question[]> {
    const typeEnum = FormType[formType as keyof typeof FormType];
    if (!typeEnum) {
      throw new BadRequestException("Tipo de formulário inválido");
    }
    return await this.assessmentRepository.findQuestionsByFormType(typeEnum);
  }

  async createAnswers(studentId: number, dto: CreateAssessmentDto): Promise<Answer[]> {
    await this.assessmentRepository.createAnswers(
        dto.answers.map(a => new Answer(
          0,
          studentId,
          a.id_question,
          a.content,
          dto.submission_date ? new Date(dto.submission_date) : new Date()
        ))
      );
    const typeEnum = FormType[dto.formType as keyof typeof FormType];
    return await this.getAnswersByStudentAndFormType(studentId, typeEnum);
  }

  async getAnswersByStudentAndFormType(studentId: number, formType: string | FormType): Promise<Answer[]> {
    const typeEnum = typeof formType === "string" ? FormType[formType as keyof typeof FormType] : formType;
    if (!typeEnum) {
      throw new BadRequestException("Tipo de formulário inválido");
    }
    const answers = await this.assessmentRepository.findAnswersByStudentAndFormType(studentId, typeEnum);
    if (!answers || answers.length === 0) {
      throw new NotFoundException("Nenhuma resposta encontrada para o aluno e tipo de formulário informado");
    }
    return answers;
  }

  async updateAnswerContent(answerId: number, dto: UpdateAnswerDto): Promise<Answer | null> {
    const updated = await this.assessmentRepository.updateAnswerContent(answerId, dto.content);
    if (!updated) {
      throw new NotFoundException(``);
    }
    return updated;
  }
}

