import { Injectable, Inject, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { AssessmentRepository } from "../infrastructure/assessment.repository";
import { CreateAssessmentDto } from "./create-assessment.dto";
import { UpdateAnswerDto } from "./update-answer.dto";
import { Form, Question, Answer } from "../domain/form.entity";
import { FormType } from "src/common/enums/domain.enums";

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
    try {
      await this.assessmentRepository.createAnswers(
        dto.answers.map(a => new Answer(
          0, // id será gerado pelo banco
          studentId,
          a.id_question,
          a.content,
          dto.submission_date ? new Date(dto.submission_date) : new Date()
        ))
      );
      const typeEnum = FormType[dto.formType as keyof typeof FormType];
      return await this.getAnswersByStudentAndFormType(studentId, typeEnum);
    } catch (err) {
      throw new InternalServerErrorException("Erro ao registrar anamnese");
    }
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

  async updateAnswerContent(studentId: number, answerId: number, dto: UpdateAnswerDto, submissionDate?: string): Promise<Answer | null> {
    try {
      const updated = await this.assessmentRepository.updateAnswerContent(answerId, dto.content);
      if (!updated) {
        throw new NotFoundException("Resposta não encontrada");
      }
      return updated;
    } catch (err) {
      throw new InternalServerErrorException("Erro ao atualizar resposta");
    }
  }
}

