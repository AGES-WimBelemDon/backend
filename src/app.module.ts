import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ExampleEntityModule } from './modules/exampleEntity/exampleEntity.module';
import { FiltersModule } from './modules/filters/filters.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { FrequencyModule } from './modules/frequency/frequency.module';
import { StudentModule } from './modules/student/student.module';
import { FamilyMemberModule } from './modules/familyMember/familyMember.module';
import { AddressModule } from './modules/address/address.module';
import { LevelModule } from './modules/level/level.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { ClassModule } from './modules/class/class.module';
import { UserModule } from './modules/user/user.module';
import { ActivityModule } from './modules/activity/activity.module';
import { DocumentModule } from './modules/document/document.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true,
    }),
    ExampleEntityModule,
    PrismaModule,
    FiltersModule,
    FirebaseModule,
    FrequencyModule,
    StudentModule,
    FamilyMemberModule,
    AddressModule,
    LevelModule,
    EnrollmentModule,
    AssessmentModule,
    ClassModule,
    AssessmentModule,
    UserModule,
    ActivityModule,
    DocumentModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
