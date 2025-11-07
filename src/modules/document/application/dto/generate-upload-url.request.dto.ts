import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, Matches, IsInt, MaxLength, IsEnum, IsOptional, IsDate } from "class-validator";
import { MimeTypes } from "src/common/enums/mime-type.enum";

export class GenerateUploadUrlRequestDto {
  @ApiProperty({
    example: 123,
    description: "ID of the student who owns the document",
  })
  @IsInt()
  @Type(() => Number)
  studentId: number;

  @ApiProperty({
    example: "student-report.pdf",
    description: "Original name of the file to be uploaded. Should include the file extension.",
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/^[a-zA-Z0-9._\-\s]+$/, {
    message: "File name can only contain letters, numbers, dots, hyphens, underscores, and spaces",
  })
  originalName: string;

  @ApiProperty({
    example: MimeTypes.APPLICATION_PDF,
    description: "MIME type of the file",
    enum: MimeTypes,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(MimeTypes, {
    message: "Invalid content type. Only allowed MIME types are permitted",
  })
  contentType: MimeTypes;

  @ApiProperty({
    example: "Student progress report for Q1 2024",
    description: "Description of the document",
    maxLength: 500,
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    example: "2024-11-07",
    description: "Date and time when the document was created (optional, defaults to now)",
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;
}