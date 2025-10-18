import { Injectable,
         Inject,
         NotFoundException,
         BadRequestException,
         forwardRef
        } from "@nestjs/common";
import { AssessmentRepository } from "../infrastructure/assessment.repository";
import { AnswerItemDto, CreateAssessmentDto } from "./create-assessment.request.dto";
import { UpdateAnswerBatchDto, UpdateAnswerDto } from "./update-answer.dto";
import { Form} from "../domain/form.entity";
import { FormType } from "src/common/enums/domain.enums";
import { Answer } from "../domain/answer.entity";
import { Question } from "../domain/question.entity";
import { StudentService } from "src/modules/student/application/student.service";

@Injectable()
export class AssessmentService {
  constructor(
    @Inject(AssessmentRepository)
    private readonly assessmentRepository: AssessmentRepository,

    @Inject(StudentService)
    private readonly studentService: StudentService,
    
  ){}
  async getAllForms(): Promise<Form[]> {
    return await this.assessmentRepository.findAllForms();
  }

  async getQuestionsByFormType(formType: FormType): Promise<Question[]> {
    return await this.assessmentRepository.findQuestionsByFormType(formType);
  }

  async createAnswers(studentId: number, dto: CreateAssessmentDto): Promise<Answer[]> {
    const student = await this.studentService.findById(studentId);
    if(!student){
      throw new NotFoundException(`The student with id ${studentId} not found.`)
    }
    const requestedQuestionIds = dto.answers.map(a => a.questionId);
    const formattedDate = this.formatDate(dto.submissionDate);
    this.checkForDuplicateQuestions(dto.answers, formattedDate);
    await this.validateQuestionsExist(requestedQuestionIds);
    await this.checkForExistingAnswers(studentId, requestedQuestionIds, formattedDate, dto.answers);
    return this.createAnswerEntities(studentId, dto);
  }
  private formatDate(date: Date | undefined | null): string {
    return date ? date.toISOString().split("T")[0] : '';
  }
  
  private checkForDuplicateQuestions(answers: AnswerItemDto[], formattedDate: string): void {
    const questionKeys = answers.map(a => `${a.questionId}-${formattedDate}`);
    const uniqueKeys = new Set(questionKeys);
    
    if (uniqueKeys.size !== answers.length) {
      throw new BadRequestException("Duplicate answers detected. Each question can only have one answer per submission date");
    };
  }
  private async validateQuestionsExist(questionIds: number[]): Promise<void> {
    const validQuestions = await this.assessmentRepository.findQuestionsByIds(questionIds);
    const validIds = validQuestions.map(q => q.id);
    const invalidIds = questionIds.filter(id => !validIds.includes(id));
    
    if (invalidIds.length > 0) {
      throw new BadRequestException(`Questions with IDs ${invalidIds.join(', ')} not found`);
    }
  }

  private async checkForExistingAnswers(
    studentId: number, 
    questionIds: number[],
    formattedDate: string,
    newAnswers: AnswerItemDto[]
  ): Promise<void> {
    const existingAnswers = await this.assessmentRepository.findAnswersByQuestionsIdsAndStudentId(
      questionIds, 
      studentId
    );
    
    const existingKeys = new Set(
      existingAnswers.map(a => `${a.questionId}-${this.formatDate(a.submissionDate)}`)
    );
    
    const hasConflict = newAnswers.some(a => 
      existingKeys.has(`${a.questionId}-${formattedDate}`)
    );
    
    if (hasConflict) {
      throw new BadRequestException(
        "Cannot create duplicate answers. Some answers already exist for this date and questions."
      );
    }
  };
  private createAnswerEntities(studentId: number, dto: CreateAssessmentDto): Promise<Answer[]> {
    const answerEntities = dto.answers.map(a => new Answer(
      0,
      studentId,
      a.questionId,
      a.content,
      dto.submissionDate
    ));
    
    return this.assessmentRepository.createAnswers(answerEntities);
  }
  async getAnswersByStudentAndFormType(studentId: number, formType: FormType): Promise<Answer[]> {
    const student = await this.studentService.findById(studentId);
    if(!student){
      throw new NotFoundException(`The student with id ${studentId} not found.`)
    }
    return await this.assessmentRepository.findAnswersByStudentAndFormType(studentId, formType);
  }

  async updateAnswerContent(answerId: number, dto: UpdateAnswerDto): Promise<Answer | null> {
    const updated = await this.assessmentRepository.updateAnswerContent(answerId, dto.content);
    if (!updated) {
      throw new NotFoundException(``);
    }
    return updated;
  }
  async updateAnswerInBatch(dto: UpdateAnswerBatchDto){
    const updates = dto.updates;
    const answersIds = updates.map(item=>item.answerId);
    const existingAnswers = await this.assessmentRepository.findAnswersByIds(answersIds);
    await this.validateAnswerExist(existingAnswers,answersIds);
    const answersToRemove = updates
    .filter(update => update.content === null)
    .map(update => update.answerId);
    const answersToUpdate = updates.filter(update => update.content !== null);
    if (answersToRemove.length > 0) {
      await this.assessmentRepository.removeAnswersByIds(answersToRemove);
    };
    if (answersToUpdate.length > 0){
      const existingAnswersMap = new Map(
        existingAnswers.map(answer => [answer.id, answer])
    );
    const mergedUpdates = answersToUpdate.map(update => {
      const existingAnswer = existingAnswersMap.get(update.answerId)!;
      return new Answer(
        update.answerId,
        existingAnswer.studentId,
        existingAnswer.questionId,
        update.content !== undefined ? update.content : existingAnswer.content,
        update.submissionDate || existingAnswer.submissionDate,
      );
    });
    
    return await this.assessmentRepository.updateAnswers(mergedUpdates);
    }
  };
  private async validateAnswerExist(validAnswers: Answer[], answersIds: number[]): Promise<void> {
    const validIds = validAnswers.map(q => q.id);
    const invalidIds = answersIds.filter(id => !validIds.includes(id));
    if (invalidIds.length > 0) {
      throw new BadRequestException(`Answers with IDs ${invalidIds.join(', ')} not found`);
    };
    
  }
}

