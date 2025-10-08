import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ExampleEntityModule } from './modules/exampleEntity/exampleEntity.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { FrequencyModule } from './modules/frequency/frequency.module';
import { StudentModule } from './modules/student/student.module';
import { FamilyMemberModule } from './modules/familyMember/familyMember.module';
import { AddressModule } from './modules/address/address.module';
import { LevelModule } from './modules/level/level.module';
import { AssessmentModule } from './modules/assessment/assessment.module';

@Module({
  imports: [
    AuthModule,
    ExampleEntityModule,
    PrismaModule,
    FirebaseModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true
    }),
    FrequencyModule,
    StudentModule,
    FamilyMemberModule,
    AddressModule,
    LevelModule,
    AssessmentModule
  ],
})
export class AppModule {}
