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
    const forms = await this.prisma.form.findMany({
      include: {
        questions: {
          include: {
            answers: false
          }
        }
      }
    });
    return forms.map(FormMapper.toDomain);
  }

  async findQuestionsByFormType(formType: FormType): Promise<Question[]> {
    const form = await this.prisma.form.findFirst({
      where: { type: formType },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    });
    if (!form || !form.questions) return [];
    return form.questions.map(QuestionMapper.toDomain);
  }

  async createAnswers(answers: Answer[]): Promise<void> {
    await this.prisma.answer.createMany({
      data: answers.map(AnswerMapper.toPersistence),
    });
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

