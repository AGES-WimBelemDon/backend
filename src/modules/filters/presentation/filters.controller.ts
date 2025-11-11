import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ClassState,
  DayOfWeek,
  EducationLevel,
  EmploymentStatus,
  FormType,
  FrequencyStatus,
  Gender,
  NoteTypes,
  Race,
  Role,
  SchoolYear,
  SocialProgram,
  StudentStatus,
  UserStatus,
} from '@prisma/client';
import { MimeTypes } from 'src/common/enums/mime-type.enum';

@Controller('filters')
@ApiTags('filters')
@ApiBearerAuth("JWT-auth")
export class FiltersController {
  @Get('form-types')
  getFormTypes(): FormType[] {
    return Object.values(FormType);
  }

  @Get('user-status')
  getUserStatus(): UserStatus[] {
    return Object.values(UserStatus);
  }

  @Get('student-status')
  getStudentStatus(): StudentStatus[] {
    return Object.values(StudentStatus);
  }

  @Get('frequency-status')
  getFrequencyStatus(): FrequencyStatus[] {
    return Object.values(FrequencyStatus);
  }

  @Get('class-state')
  getClassState(): ClassState[] {
    return Object.values(ClassState);
  }

  @Get('races')
  getRaces(): Race[] {
    return Object.values(Race);
  }

  @Get('genders')
  getGenders(): Gender[] {
    return Object.values(Gender);
  }

  @Get('social-programs')
  getSocialPrograms(): SocialProgram[] {
    return Object.values(SocialProgram);
  }

  @Get('employment-status')
  getEmploymentStatus(): EmploymentStatus[] {
    return Object.values(EmploymentStatus);
  }

  @Get('school-years')
  getSchoolYears(): SchoolYear[] {
    return Object.values(SchoolYear);
  }

  @Get('education-levels')
  getEducationLevels(): EducationLevel[] {
    return Object.values(EducationLevel);
  }

  @Get('note-types')
  getNoteTypes(): NoteTypes[] {
    return Object.values(NoteTypes);
  }

  @Get('week-days')
  getWeekDays(): DayOfWeek[] {
    return Object.values(DayOfWeek);
  }

  @Get('roles')
  getRoles(): Role[] {
    return Object.values(Role);
  }

  @Get('mime-types')
  getMimeTypes(): MimeTypes[] {
    return Object.values(MimeTypes);
  }
}
