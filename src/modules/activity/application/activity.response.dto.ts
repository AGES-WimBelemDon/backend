import { ApiProperty } from "@nestjs/swagger";

export class ActivityResponseDto {
  @ApiProperty({
    example: 1,
    description: "Unique identifier of the activity",
  })
  id!: number;

  @ApiProperty({
    example: "Esporte",
    description: "Name of the activity",
  })
  name!: string;
}
