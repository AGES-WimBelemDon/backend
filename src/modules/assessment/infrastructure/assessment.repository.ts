import { PrismaClient, FormType } from '@prisma/client';
import { Form, Question, Answer } from '../domain/form.entity';

export class AssessmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // GET /form/
  async findAllForms(): Promise<Form[]> {
    const forms = await this.prisma.form.findMany();
    return forms.map(f => new Form(f.id, f.title, f.type));
  }

  // GET /form/:formType/questions
  async findQuestionsByFormType(formType: FormType): Promise<Question[]> {
    const form = await this.prisma.form.findFirst({
      where: { type: formType },
      include: { questions: true },
    });
    if (!form) return [];
    return form.questions
      .map(q => new Question(
        q.id,
        q.formId,
        q.statement,
        q.isRequired ?? false
      ));
  }

  // POST /student/:id/assessments
  async createAnswers(answers: Answer[]): Promise<void> {
    await this.prisma.answer.createMany({
      data: answers.map(a => ({
        studentId: a.studentId,
        questionId: a.questionId,
        content: a.content,
      })),
    });
  }

  // GET /student/:id/assessments?formType=PSICOLOGIA
  async findAnswersByStudentAndFormType(studentId: number, formType: FormType): Promise<Answer[]> {
    const rows = await this.prisma.answer.findMany({
      where: {
        studentId,
        question: { form: { type: formType } },
      },
      include: { question: true },
    });
    return rows.map(r => new Answer(
      r.id,
      r.studentId,
      r.questionId,
      r.content
    ));
  }

  // PATCH /student/:id/assessments/:answerId
  async updateAnswerContent(answerId: number, content: string): Promise<Answer | null> {
    const r = await this.prisma.answer.update({
      where: { id: answerId },
      data: { content },
    });
  return r ? new Answer(r.id, r.studentId, r.questionId, r.content) : null;
  }
}
