import { Injectable,
         Inject,
         NotFoundException,
         BadRequestException
        } from "@nestjs/common";
import { AssessmentRepository } from "../infrastructure/assessment.repository";
import { CreateAssessmentDto } from "./create-assessment.request.dto";
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

  async getQuestionsByFormType(formType: FormType): Promise<Question[]> {
    return await this.assessmentRepository.findQuestionsByFormType(formType);
  }

  async createAnswers(studentId: number, dto: CreateAssessmentDto): Promise<Answer[]> {
    const requestedQuestionsIds = dto.answers.map(a => a.questionId).sort((a,b)=>a-b);
    const submissionDate = this.formatDate(dto.submissionDate);
    const questionDateCompositeKeys = dto.answers.map(item => item.questionId + "-" + submissionDate);
    if(questionDateCompositeKeys.length !== dto.answers.length){
      throw new BadRequestException("Duplicate answers detected. Each question can only have one answer per submission date");
    }
    const validQuestions = await this.assessmentRepository.findQuestionsByIds(requestedQuestionsIds);
    const validQuestionsIds = validQuestions.map((item)=>item.id);
    const invalidQuestionsIds = requestedQuestionsIds.filter(id => !validQuestionsIds.includes(id));
    if (invalidQuestionsIds.length > 0) {
      throw new BadRequestException(`Questions with IDs ${invalidQuestionsIds.join(', ')} not found`);
    };
    const listStudentAnswers = await this.assessmentRepository.findAnwswersByQuestionsIdsAndStudentId(validQuestionsIds,studentId);
    const existingAnswerKeys = new Set(
      listStudentAnswers.map(answer => `${answer.questionId}-${this.formatDate(answer.submissionDate)}`)
    );
    for (let index = 0; index < questionDateCompositeKeys.length; index++) {
      if( existingAnswerKeys.has(questionDateCompositeKeys[index])){
        throw new BadRequestException("Cannot create duplicate answers. Some answers already exist for this date and questions.");
      }
    }
    return await this.assessmentRepository.createAnswers(
        dto.answers.map(a => new Answer(
          0,
          studentId,
          a.questionId,
          a.content,
          dto.submissionDate
        ))
      );
  }
  formatDate(date: Date | undefined | null): string {
    return date ? date.toISOString().split("T")[0] : '';
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

