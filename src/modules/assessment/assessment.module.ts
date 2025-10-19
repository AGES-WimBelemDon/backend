import { forwardRef, Module } from '@nestjs/common';
import { AssessmentController } from './presentation/assessment.controller';
import { AssessmentService } from './application/assessment.service';
import { AssessmentRepository } from './infrastructure/assessment.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnswerMapper, QuestionMapper, FormMapper } from './infrastructure/assessment.mapper';
import { StudentModule } from '../student/student.module';
import { ASSESSMENT_REPOSITORY_TOKEN } from './domain/assessment-repository.interface';

@Module({
  imports:[
     StudentModule,
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService,
    {
        provide: ASSESSMENT_REPOSITORY_TOKEN,
        useClass: AssessmentRepository,
    },
    PrismaService,
    AnswerMapper,
    QuestionMapper,
    FormMapper],
})
export class AssessmentModule {}

