import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches, IsIn } from "class-validator";

export class GenerateUrlDto {
  @ApiProperty({
    example: "document.pdf",
    description: "Name of the file to be uploaded. Should include the file extension.",
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: "File name can only contain letters, numbers, dots, hyphens, and underscores",
  })
  fileName: string;

  @ApiProperty({
    example: "application/pdf",
    description: "MIME type of the file being uploaded",
    enum: [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ], {
    message: "Invalid content type. Only PDF, images, Word, Excel, and text files are allowed",
  })
  contentType: string;
}