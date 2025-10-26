import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  EducationLevel,
  EmploymentStatus,
  FormType,
  Gender,
  NoteTypes,
  Race,
  SchoolYear,
  SocialProgram,
} from '@prisma/client';

@Controller('filters')
@ApiTags('filters')
export class FiltersController {
  @Get('form-types')
  getFormTypes(): FormType[] {
    return Object.values(FormType);
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
}
