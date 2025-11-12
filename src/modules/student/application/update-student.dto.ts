import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStudentRequestDTO } from './create-student.request.dto';
import { 
    IsDate,
    IsEnum,
    IsOptional
} from 'class-validator';
import { Transform } from 'class-transformer';
import { transformDateStringToDate } from 'src/common/transformers/string.to.date.transformer';
import { StudentStatus } from 'src/common/enums/domain.enums';

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

    @ApiProperty({
        example: StudentStatus.ATIVO,
        description: "Current status of the student in the system",
        enum: StudentStatus,
        enumName: 'StudentStatus',
        required: false
    })
    @IsEnum(StudentStatus, { message: "Status must be a valid StudentStatus value" })
    @IsOptional()
    status?: StudentStatus;
}