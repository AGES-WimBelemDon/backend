import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStudentRequestDTO } from './create-student.request.dto';
import { 
    IsDate,
    IsOptional
} from 'class-validator';
import { Transform } from 'class-transformer';
import { transformDateStringToDate } from 'src/common/transformers/string.to.date.transformer';

export class UpdateStudentDTO extends PartialType(CreateStudentRequestDTO) {
    @ApiProperty({
        example: "2025-09-11",
        description: "Student's date of enrollment in the WimbelemDon project",
        type: String,
        format: 'date',
        required: false
    })    
    @Transform(transformDateStringToDate, { toClassOnly: true })
    @IsOptional()
    @IsDate({ message: "Date of enrollment must be a valid date (YYYY-MM-DD)" })
    enrollmentDate?: Date;
    @ApiProperty({
        example: "2025-09-11",
        description: "Student's date of disenrollment with the WimbelemDon project",
        type: String,
        format: 'date',
        required: false
    })    
    @Transform(transformDateStringToDate, { toClassOnly: true })
    @IsOptional()
    @IsDate({ message: "Date of enrollment must be a valid date (YYYY-MM-DD)" })
    disenrollmentDate?: Date;
}