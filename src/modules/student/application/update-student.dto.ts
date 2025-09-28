import { PartialType } from '@nestjs/swagger';
import { CreateStudentDTO } from './create-student.dto';

export class UpdateStudentDTO extends PartialType(CreateStudentDTO) {}