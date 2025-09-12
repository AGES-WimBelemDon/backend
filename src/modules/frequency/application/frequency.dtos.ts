import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class ActivityResponseDTO {
  @ApiProperty({ 
    example: 1, 
    description: "The ID of the activity",
    nullable: true 
  })
  activityId: number | null;

  @ApiProperty({ 
    example: "Esportes", 
    description: "The name of the activity" 
  })
  activityName: string;
}

export class UserClassesDTO {
  @ApiProperty({ 
    example: 1, 
    description: "The ID of the class", 
    nullable: true 
  })
  classId: number | null;

  @ApiProperty({ 
    example: "Tênis I", 
    description: "The name of the class",
    nullable: true 
  })
  className: string | null;
  @ApiProperty({ 
    example: "ATIVA", 
    description: "The current state of the class" 
  })
  classState: string;

  @ApiProperty({ 
    example: "Iniciante", 
    description: "The level of the class",
    nullable: true 
  })
  levelName: string | null;

  @ApiProperty({ 
    example: false, 
    description: "Indicates if this is a general roll call class (always false for specific classes)" 
  })
  isGeral: boolean;
  @ApiProperty({ 
    type: ActivityResponseDTO, 
    description: "Details of the activity associated with the class" 
  })
  activity: ActivityResponseDTO;
}

export class ResponseGetMyClassesDTO{
    @ApiProperty({
      type: [UserClassesDTO],
      description: "A list of available classes for the user"
    })
    classes : UserClassesDTO[]
}

export class StudentGeneralAttendanceDTO{
  @ApiProperty({ 
    example: 1, 
    description: "The ID of the student",
    nullable: false 
  })
  studentId: number;
  @ApiProperty({
    example: "John Doe",
    description: "The full name of the student",
    nullable: false
  })
  fullName: string;
  
  @ApiProperty({
    example: "2025-09-11",
    description: "The requested frequency list date"
  })
  date: String|null;

  @ApiProperty({
  description: "Indicates whether the student's attendance can be registered in the general attendance list. \
  - true: the student can be marked directly in the general attendance list. \
  - false: the student's attendance is controlled by another class and cannot be modified here."
})
  generalAttendanceAllowed: boolean;
  @ApiProperty({
    description: "Describes if a student was present or not",
    example: "PRESENTE"
})
  status: 'PRESENTE' | 'AUSENTE';
}