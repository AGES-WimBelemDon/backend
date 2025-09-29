import { Answer as PrismaAnswer, Question as PrismaQuestion, Form as PrismaForm } from '@prisma/client';
import { Answer, Question, Form } from '../domain/form.entity';

export class AnswerMapper {
  static toDomain(prismaAnswer: PrismaAnswer): Answer {
    return new Answer(
      prismaAnswer.id,
      prismaAnswer.studentId,
      prismaAnswer.questionId,
      prismaAnswer.content,
      //prismaAnswer.submissionDate
    );
  }

  static toPersistence(answer: Answer): PrismaAnswer {
    return {
      id: answer.id,
      studentId: answer.studentId,
      questionId: answer.questionId,
      content: answer.content,
      submissionDate: answer.submissionDate
    } as PrismaAnswer;
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
}
