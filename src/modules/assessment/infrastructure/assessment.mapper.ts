import {
  Answer as PrismaAnswer,
  Question as PrismaQuestion,
  Form as PrismaForm,
} from "@prisma/client";
import { Answer } from "../domain/answer.entity";
import { Question } from "../domain/question.entity";
import { Form } from "../domain/form.entity";
import { FormResponseDTO } from "../application/form.response.dto";
import { QuestionsResponseDTO } from "../application/questions.response.dto";
import { AssessmentResponseDto } from "../application/create-assesment.response.dto";

export class AnswerMapper {
  static toDomain(prismaAnswer: PrismaAnswer): Answer {
    return new Answer(
      prismaAnswer.id,
      prismaAnswer.studentId,
      prismaAnswer.questionId,
      prismaAnswer.content,
      prismaAnswer.submissionDate,
    );
  }

  static toPersistence(answer: Answer): any {
    return {
      studentId: answer.studentId,
      questionId: answer.questionId,
      content: answer.content,
      submissionDate: answer.submissionDate,
    };
  }

  static toReponse(answer: Answer): AssessmentResponseDto {
    return {
      studentId: answer.studentId,
      content: answer.content,
      answerId: answer.id,
      questionId: answer.questionId,
      submissionDate: answer.submissionDate.toISOString().split("T")[0],
    };
  }
}

export class QuestionMapper {
  static toDomain(
    prismaQuestion: PrismaQuestion & { answers?: PrismaAnswer[] },
  ): Question {
    return new Question(
      prismaQuestion.id,
      prismaQuestion.formId,
      prismaQuestion.statement,
      prismaQuestion.isRequired ?? false,
      prismaQuestion.answers
        ? prismaQuestion.answers.map((item) => AnswerMapper.toDomain(item))
        : [],
    );
  }
  static toResponse(question: Question): QuestionsResponseDTO {
    return {
      formId: question.formId,
      isRequired: question.isRequired,
      questionId: question.id,
      statement: question.statement,
    };
  }
}

export class FormMapper {
  static toDomain(
    prismaForm: PrismaForm & {
      questions?: (PrismaQuestion & { answers?: PrismaAnswer[] })[];
    },
  ): Form {
    return new Form(
      prismaForm.id,
      prismaForm.title,
      prismaForm.type,
      prismaForm.questions
        ? prismaForm.questions.map((question) =>
            QuestionMapper.toDomain(question),
          )
        : [],
    );
  }
  static toResponse(form: Form): FormResponseDTO {
    return {
      id: form.id,
      title: form.title,
      type: form.type,
    };
  }
}
