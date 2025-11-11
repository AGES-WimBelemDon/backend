import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class ConfirmUploadRequestDto {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description:
      "Unique identifier of the document to confirm upload completion",
    format: "uuid",
  })
  @IsUUID()
  fileId: string;
}
