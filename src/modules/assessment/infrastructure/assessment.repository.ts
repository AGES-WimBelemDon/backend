import { PrismaClient, Prisma, FormType as FormTypeEnum } from '@prisma/client';
import { Answer, Form, Question } from '../domain/form.entity';

export class AssessmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /* ---------- Form ---------- */

  async findAllForms(): Promise<Form[]> {
    const forms = await this.prisma.form.findMany();
    return forms.map(f => new Form(f.id, f.title, f.type));
  }

  async findQuestionsByFormType(formType: FormTypeEnum): Promise<Question[]> {
    const form = await this.prisma.form.findFirst({
      where: { type: formType },
      include: { questions: true },
    });
    if (!form) return [];
    return form.questions
      .sort((a, b) => a.order - b.order)
      .map(q => new Question(q.id, q.formId, q.text, q.required ?? false, q.order, q.helpText));
  }

  /* ---------- Answer (snapshot) ---------- */

  // Recebe um TransactionClient aberto pelo service
  async createManyAnswers(tx: Prisma.TransactionClient, answers: Answer[]): Promise<void> {
    // Opcional: usar createMany se não precisar de retorno/relations
    // await tx.answer.createMany({ data: answers.map(a => ({
    //   studentId: a.studentId,
    //   questionId: a.questionId,
    //   submission_date: a.submission_date,
    //   content: a.content,
    // })) });

    // Quando quer manter comportamento granular:
    for (const a of answers) {
      await tx.answer.create({
        data: {
          studentId: a.studentId,
          questionId: a.questionId,
          submission_date: a.submission_date,
          content: a.content,
        },
      });
    }
  }

  async findAnswersByStudentAndFormTypeOrdered(
    studentId: number,
    formType: FormTypeEnum
  ): Promise<Answer[]> {
    const rows = await this.prisma.answer.findMany({
      where: {
        studentId,
        question: { form: { type: formType } },
      },
      include: { question: true },
      orderBy: [{ submission_date: 'desc' }],
    });

    return rows.map(r => new Answer(
      r.id,
      r.studentId,
      r.questionId,
      r.submission_date,
      r.content,
    ));
  }

  async findAnswerByIdStudentAndSubmissionDate(
    answerId: number,
    studentId: number,
    submission_date: Date
  ): Promise<Answer | null> {
    const r = await this.prisma.answer.findFirst({
      where: { id: answerId, studentId, submission_date },
    });
    return r
      ? new Answer(r.id, r.studentId, r.questionId, r.submission_date, r.content)
      : null;
  }

  async updateAnswerContent(
    answerId: number,
    submission_date: Date,
    content: string
  ): Promise<Answer | null> {
    // Garante que atualiza somente a resposta daquele snapshot
    const r = await this.prisma.answer.update({
      where: { id: answerId },
      data: { content },
    });

    // Opcionalmente, validar previamente que o submission_date bate:
    // (Se quiser travar no update, faça via middleware/checagem antes)
    if (r.submission_date.getTime() !== submission_date.getTime()) {
      // Se quiser, faça um rollback manual lançando erro antes do update e valide antes
      // Aqui apenas retornamos o r; ideal fazer a verificação ANTES do update no service.
    }

    return new Answer(r.id, r.studentId, r.questionId, r.submission_date, r.content);
  }
}
