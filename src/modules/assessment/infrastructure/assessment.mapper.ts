import {
  Answer as PrismaAnswer,
  Question as PrismaQuestion,
  Form as PrismaForm } from '@prisma/client';
import { Answer } from '../domain/answer.entity';
import { Question } from '../domain/question.entity';
import { Form } from '../domain/form.entity';
import { FormResponseDTO } from '../application/form.response.dto';


export class AnswerMapper {
  static toDomain(prismaAnswer: PrismaAnswer): Answer {
    return new Answer(
      prismaAnswer.id,
      prismaAnswer.studentId,
      prismaAnswer.questionId,
      prismaAnswer.content,
      // se o client estiver gerado com o schema novo, esse campo existe
      (prismaAnswer as any).submissionDate
    );
  }

  static toPersistence(answer: Answer): any /* Prisma.AnswerCreateManyInput */ {
    // Não enviar 'id' para permitir autoincrement no banco
    return {
      studentId: answer.studentId,
      questionId: answer.questionId,
      content: answer.content
      // Intencionalmente omitimos 'submissionDate' para manter compatibilidade
      // com bancos que ainda não têm a coluna; o default do DB cobre o valor.
    };
  }
}

export class QuestionMapper {
  static toDomain(prismaQuestion: PrismaQuestion & { answers?: PrismaAnswer[] }): Question {
    return new Question(
      prismaQuestion.id,
      prismaQuestion.formId,
      prismaQuestion.statement,
      prismaQuestion.isRequired ?? false,
      prismaQuestion.answers ? prismaQuestion.answers.map(AnswerMapper.toDomain) : []
    );
  }
}

export class FormMapper {
  static toDomain(prismaForm: PrismaForm & { questions?: (PrismaQuestion & { answers?: PrismaAnswer[] })[] }): Form {
    return new Form(
      prismaForm.id,
      prismaForm.title,
      prismaForm.type,
      prismaForm.questions ? prismaForm.questions.map(QuestionMapper.toDomain) : []
    );
  }
  static toResponse(form: Form): FormResponseDTO {
    return {
      id: form.id,
      title: form.title,
      type: form.type
    };
  }
}
