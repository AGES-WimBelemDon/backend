import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateActivityDto {
  @ApiProperty({
    example: "Esportes",
    description: "Updated name of the activity",
    minLength: 1,
    maxLength: 100,
  })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  @MaxLength(100, { message: "Name must be at most 100 characters long" })
  name!: string;
}
