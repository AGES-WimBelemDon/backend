import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsEmail, IsDate } from "class-validator";
export class CreateExampleEntityDTO {
    @ApiProperty({ example: "Bob Smith", description: "The complete name" })
    @IsString()
    @IsNotEmpty()
    name  : string
    @ApiProperty({ example: "bobSmith@email.com", description: "The complete email" })
    @IsEmail()
    @IsNotEmpty()
    email : string
    @ApiProperty({ example: "2025-08-04", description: "The birth data" })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    birthDate : Date
}