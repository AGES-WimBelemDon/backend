import { ApiProperty } from "@nestjs/swagger";

export class DocumentResponseDto {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "Unique identifier of the document",
  })
  id: string;

  @ApiProperty({
    example: 123,
    description: "ID of the student who owns the document",
  })
  studentId: number;

  @ApiProperty({
    example: "student-report.pdf",
    description: "Original name of the uploaded file",
  })
  originalName: string;

  @ApiProperty({
    example: "application/pdf",
    description: "MIME type of the file",
  })
  contentType: string;

  @ApiProperty({
    example: "Student progress report for Q1 2024",
    description: "Description of the document",
  })
  description: string;

  @ApiProperty({
    example: "2024-11-07T12:00:00Z",
    description: "Date and time when the document was created",
  })
  createdAt: Date;

  @ApiProperty({
    example:
      "https://storage.googleapis.com/your-bucket/documents/student-123/550e8400-report.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=...",
    description:
      "Presigned URL for uploading the file to Firebase Storage. Valid for 60 minutes.",
  })
  url: string;
}
