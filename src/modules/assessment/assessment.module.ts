import { Module } from '@nestjs/common';
import { AssessmentController } from './presentation/assessment.controller';
import { AssessmentService } from './application/assessment.service';
import { AssessmentRepository } from './infrastructure/assessment.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnswerMapper, QuestionMapper, FormMapper } from './infrastructure/assessment.mapper';

@Module({
  controllers: [AssessmentController],
  providers: [AssessmentService, AssessmentRepository, PrismaService, AnswerMapper, QuestionMapper, FormMapper],
})
export class AssessmentModule {}
