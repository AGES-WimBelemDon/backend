import { Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ParseEnumPipe} from "@nestjs/common";
import { AssessmentService } from "../application/assessment.service";
import { CreateAssessmentDto } from "../application/create-assessment.request.dto";
import { UpdateAnswerDto } from "../application/update-answer.dto";
import { Answer } from "../domain/answer.entity";
import { Question } from "../domain/question.entity";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { FormResponseDTO } from "../application/form.response.dto";
import { FormType } from "src/common/enums/domain.enums";
import { AnswerMapper, FormMapper, QuestionMapper } from "../infrastructure/assessment.mapper";
import { QuestionsResponseDTO } from "../application/questions.response.dto";
import { AssessmentResponseDto } from "../application/create-assesment.response.dto";


@Controller("assessment")
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Get("forms")
  @ApiOperation({ 
    summary: "Get all assessment forms",
    description: "Retrieves all available assessment forms in the system without their questions"
  })
  @ApiResponse({ 
    status: 200, 
    description: "Forms successfully retrieved",
    type: [FormResponseDTO],
    schema: {
      example: [
        {
          id: 1,
          title: "Initial Psichology form",
          type: FormType.PSICOLOGIA
        },
        {
          id: 2,
          title: "Initial social form",
          type: FormType.SOCIAL
        }
      ]
    }
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
    schema: {
      example: {
        statusCode: 500,
        message: "Internal server error",
        error: "Error retrieving forms from database"
      }
    }
  })
  async getAllForms(): Promise<FormResponseDTO[]> {
    const list = await this.assessmentService.getAllForms();
    return list.map(FormMapper.toResponse);
  }
  @Get("form/:formType/questions")
  @ApiOperation({ 
    summary: "Get questions by form type",
    description: "Retrieves all questions associated with a specific form type"
  })
  @ApiParam({ 
    name: "formType", 
    enum: FormType,
    description: "The type of form to retrieve questions for",
    example: "PSICOLOGIA",
    required: true
  })
  @ApiResponse({
    status: 200,
    description: "Questions successfully retrieved",
    type: [QuestionsResponseDTO],
    schema: {
      example: [
        {
          questionId: 1,
          formId: 1,
          statement: "How would you rate your overall experience?",
          isRequired: true
        },
        {
          questionId: 2,
          formId: 1,
          statement: "What aspects of the program have been most helpful?",
          isRequired: true
        },
        {
          questionId: 3,
          formId: 1,
          statement: "Do you have any suggestions for improvement?",
          isRequired: false
        }
      ]
    }
  })
  @ApiResponse({
    status: 400,
    description: "Invalid form type provided",
    schema: {
      example: {
        statusCode: 400,
        message: "formType must be a valid enum value",
        error: "Bad Request"
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
    schema: {
      example: {
        statusCode: 500,
        message: "Internal server error",
        error: "Failed to retrieve questions"
      }
    }
  })
  async getQuestionsByFormType(
    @Param("formType", new ParseEnumPipe(FormType)) formType: FormType
  ): Promise<QuestionsResponseDTO[]> {
    const questions = await this.assessmentService.getQuestionsByFormType(formType);
    return questions.map(QuestionMapper.toResponse);
  }
  @Post("student/:id/assessments")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: "Submit student assessment answers",
    description: "Creates multiple answers for a student's assessment form with validation for duplicate questions and existing answers"
  })
  @ApiParam({ 
    name: "id", 
    description: "Student ID",
    type: Number,
    example: 1,
    required: true
  })
  @ApiBody({
    description: "Assessment data with answers",
    type: CreateAssessmentDto,
    examples: {
      validAssessment: {
        summary: "Valid assessment submission",
        value: {
          submissionDate: "2025-10-17",
          answers: [
            {
              questionId: 1,
              content: "Yes, I have noticed improvement in my communication skills."
            },
            {
              questionId: 2,
              content: "The individual counseling sessions were most helpful."
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Answers successfully submitted",
    type: [AssessmentResponseDto],
    schema: {
      example: [
        {
          answerId: 42,
          submissionDate: "2025-10-17",
          questionId: 1,
          studentId: 1,
          content: "Yes, I have noticed improvement in my communication skills."
        },
        {
          answerId: 43,
          submissionDate: "2025-10-17",
          questionId: 2,
          studentId: 1,
          content: "The individual counseling sessions were most helpful."
        }
      ]
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid request data",
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string' },
            error: { type: 'string', example: 'Bad Request' }
          }
        },
        examples: {
          duplicateQuestions: {
            summary: "Duplicate questions in request",
            value: {
              statusCode: 400,
              message: "Duplicate answers detected. Each question can only have one answer per submission date",
              error: "Bad Request"
            }
          },
          nonExistentQuestions: {
            summary: "Questions not found",
            value: {
              statusCode: 400,
              message: "Questions with IDs 99, 100 not found",
              error: "Bad Request"
            }
          },
          existingAnswers: {
            summary: "Answers already exist",
            value: {
              statusCode: 400,
              message: "Cannot create duplicate answers. Some answers already exist for this date and questions.",
              error: "Bad Request"
            }
          },
          invalidDate: {
            summary: "Invalid date format",
            value: {
              statusCode: 400,
              message: "Submission date must be a valid date (YYYY-MM-DD)",
              error: "Bad Request"
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Student not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Student with ID 1 not found",
        error: "Not Found"
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    schema: {
      example: {
        statusCode: 500,
        message: "Internal server error",
        error: "Failed to create answers"
      }
    }
  })
  async createAnswers(
    @Param("id", ParseIntPipe) studentId: number,
    @Body() dto: CreateAssessmentDto
  ): Promise<AssessmentResponseDto[]> {
    const resp = await this.assessmentService.createAnswers(studentId, dto);
    return resp.map(AnswerMapper.toReponse);
  }

  @Get("student/:id/assessments")
  async getAnswersByStudentAndFormType(
    @Param("id", ParseIntPipe) studentId: number,
    @Query("formType") formType: string
  ): Promise<Answer[]> {
    return await this.assessmentService.getAnswersByStudentAndFormType(studentId, formType);
  }

  @Patch("student/:id/assessments/:answerId")
  async updateAnswerContent(
    @Param("id", ParseIntPipe) studentId: number,
    @Param("answerId", ParseIntPipe) answerId: number,
    @Body() dto: UpdateAnswerDto,
    @Query("submission_date") submissionDate?: string
  ): Promise<Answer | null> {
    return await this.assessmentService.updateAnswerContent(answerId, dto);
  }
}
