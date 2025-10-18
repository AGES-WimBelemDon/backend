import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';
import { FormType } from 'src/common/enums/domain.enums';
import { Form } from '../domain/form.entity';
import { AnswerMapper, QuestionMapper, FormMapper } from "./assessment.mapper";
import { Answer } from "../domain/answer.entity";
import { Question } from "../domain/question.entity";

@Injectable()
export class AssessmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForms(): Promise<Form[]> {
    const forms = await this.prisma.form.findMany();
    return forms?.map(FormMapper.toDomain) || [];
  }

  async findQuestionsByFormType(formType: FormType): Promise<Question[]> {
    const form = await this.prisma.form.findFirst({
      where: { type: formType },
      include: {
        questions: {
          include: {
            answers: false
          }
        }
      }
    });
    return form?.questions?.map(QuestionMapper.toDomain) || [];
  }
  async createAnswers(answers: Answer[]): Promise<Answer[]> {
    const createdAnswers = await this.prisma.$transaction(
      answers.map(answer => 
        this.prisma.answer.create({
          data: AnswerMapper.toPersistence(answer)
        })
      )
    );
    return createdAnswers.map(AnswerMapper.toDomain);
  }
  async findQuestionsByIds(questionsIds: number[]): Promise<Question[]>{
    const resp = await this.prisma.question.findMany({
      where: {
        id : {
          in : questionsIds
        }
      },
      orderBy : {
        id: "asc"
      }
    });
    return resp.map(QuestionMapper.toDomain);
  };
  async findAnswersByQuestionsIdsAndStudentId(questionsId: number[], studentId: number): Promise<Answer[]>{
    const resp = await this.prisma.answer.findMany({
      where: {
        questionId : {
          in: questionsId
        },
        studentId : studentId
      }
    });
    return resp.map(AnswerMapper.toDomain)
  }
  async findAnswersByIds(answersId: number[]){
    const resp = await this.prisma.answer.findMany({
      where : {
        id : {
          in: answersId
        }
      }
    });
    return resp.map(AnswerMapper.toDomain);
  }
  async removeAnswersByIds(answersIds: number[]):Promise<void>{
    await this.prisma.answer.deleteMany({
      where: {
        id : {
          in: answersIds
        }
      }
    })
  }
  async updateAnswers(answers: Answer[]): Promise<Answer[]> {
    const updatedAnswers = await this.prisma.$transaction(
      answers.map(answer => 
        this.prisma.answer.update({
          where: { id: answer.id },
          data: {
            content: answer.content,
            submissionDate: answer.submissionDate
          }
        })
      )
    );
    return updatedAnswers.map(AnswerMapper.toDomain);
  }
  async findAnswersByStudentAndFormType(studentId: number, formType: FormType): Promise<Answer[]> {
    const rows = await this.prisma.answer.findMany({
      where: {
        studentId,
        question: { form: { type: formType } },
      },
      include: { question: true },
    });
    return rows.map(AnswerMapper.toDomain);
  }

  async updateAnswerContent(answerId: number, content: string): Promise<Answer | null> {
    const r = await this.prisma.answer.update({
      where: { id: answerId },
      data: { content },
    });
    return r ? AnswerMapper.toDomain(r) : null;
  }
}

