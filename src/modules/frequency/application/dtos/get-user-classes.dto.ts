import { ApiProperty } from "@nestjs/swagger";

export class ActivityResponseDTO {
  @ApiProperty({
    example: 1,
    description: "The ID of the activity",
    nullable: true,
  })
  activityId: number | null;

  @ApiProperty({
    example: "Esportes",
    description: "The name of the activity",
  })
  activityName: string;
}

export class UserClassesDTO {
  @ApiProperty({
    example: 1,
    description: "The ID of the class",
    nullable: true,
  })
  classId: number | null;

  @ApiProperty({
    example: "Tênis I",
    description: "The name of the class",
    nullable: true,
  })
  className: string | null;
  @ApiProperty({
    example: "ATIVA",
    description: "The current state of the class",
  })
  classState: string;

  @ApiProperty({
    example: "Iniciante",
    description: "The level of the class",
    nullable: true,
  })
  levelName: string | null;

  @ApiProperty({
    example: false,
    description:
      "Indicates if this is a general roll call class (always false for specific classes)",
  })
  isGeral: boolean;
  @ApiProperty({
    type: ActivityResponseDTO,
    description: "Details of the activity associated with the class",
  })
  activity: ActivityResponseDTO;
}
export class UserClassesResponseDTO {
  @ApiProperty({
    type: [UserClassesDTO],
    description: "A list of available classes for the user",
  })
  classes: UserClassesDTO[];
}
