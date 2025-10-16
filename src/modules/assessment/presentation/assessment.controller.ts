import { Controller, Get, Post, Patch, Param, Query, Body, HttpCode,
     HttpStatus, ParseIntPipe, 
     ParseEnumPipe} from '@nestjs/common';
import { AssessmentService } from '../application/assessment.service';
import { CreateAssessmentDto } from '../application/create-assessment.dto';
import { UpdateAnswerDto } from '../application/update-answer.dto';
import { Answer } from '../domain/answer.entity';
import { Question } from '../domain/question.entity';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FormResponseDTO } from '../application/form.response.dto';
import { FormType } from 'src/common/enums/domain.enums';
import { FormMapper } from '../infrastructure/assessment.mapper';


@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Get('forms')
  @ApiOperation({ 
    summary: 'Get all assessment forms',
    description: 'Retrieves all available assessment forms in the system without their questions'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Forms successfully retrieved',
    type: [FormResponseDTO],
    schema: {
      example: [
        {
          id: 1,
          title: 'Initial Psichology form',
          type: FormType.PSICOLOGIA
        },
        {
          id: 2,
          title: 'Initial social form',
          type: FormType.SOCIAL
        }
      ]
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Error retrieving forms from database'
      }
    }
  })
  async getAllForms(): Promise<FormResponseDTO[]> {
    const list = await this.assessmentService.getAllForms();
    return list.map(FormMapper.toResponse);
  }

  @Get('form/:formType/questions')
  @ApiOperation({ 
    summary: 'Get questions by form type',
    description: 'Retrieves all questions for a specific form type'
  })
  @ApiParam({ 
    name: 'formType', 
    enum: FormType,
    description: 'The type of form to retrieve questions for'
  })
  @ApiResponse({
    status: 200,
    description: 'Questions successfully retrieved',
    schema: {
      example: [
        {
          id: 1,
          statement: 'How would you rate your overall experience?',
          isRequired: true,
          formId: 1
        }
      ]
    }
  })
  async getQuestionsByFormType(
    @Param('formType', new ParseEnumPipe(FormType)) formType: FormType
  ): Promise<Question[]> {
    return await this.assessmentService.getQuestionsByFormType(formType);
  }

  @Post('student/:id/assessments')
  @HttpCode(HttpStatus.CREATED)
  async createAnswers(
    @Param('id', ParseIntPipe) studentId: number,
    @Body() dto: CreateAssessmentDto
  ): Promise<Answer[]> {
    return await this.assessmentService.createAnswers(studentId, dto);
  }

  @Get('student/:id/assessments')
  async getAnswersByStudentAndFormType(
    @Param('id', ParseIntPipe) studentId: number,
    @Query('formType') formType: string
  ): Promise<Answer[]> {
    return await this.assessmentService.getAnswersByStudentAndFormType(studentId, formType);
  }

  @Patch('student/:id/assessments/:answerId')
  async updateAnswerContent(
    @Param('id', ParseIntPipe) studentId: number,
    @Param('answerId', ParseIntPipe) answerId: number,
    @Body() dto: UpdateAnswerDto,
    @Query('submission_date') submissionDate?: string
  ): Promise<Answer | null> {
    return await this.assessmentService.updateAnswerContent(answerId, dto);
  }
}
