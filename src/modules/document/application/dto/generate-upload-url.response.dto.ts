import { ApiProperty } from "@nestjs/swagger";

export class GenerateUploadUrlResponseDTO {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "Unique identifier of the created document record",
  })
  documentId: string;

  @ApiProperty({
    example:
      "https://storage.googleapis.com/your-bucket/documents/student-123/550e8400-report.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=...",
    description:
      "Presigned URL for uploading the file to Firebase Storage. Valid for 15 minutes.",
  })
  url: string;
}
