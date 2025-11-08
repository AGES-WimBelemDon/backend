import { Controller, Post, Body, HttpCode, HttpStatus, Param, Get, ParseIntPipe, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { DocumentService } from "../application/document.service";
import { GenerateUploadUrlRequestDto } from "../application/dto/generate-upload-url.request.dto";
import { GenerateUploadUrlResponseDTO } from "../application/dto/generate-upload-url.response.dto";
import { ConfirmUploadRequestDto } from "../application/dto/confirm-upload.request.dto";
import { DocumentResponseDto } from "../application/dto/document.response.dto";

@ApiTags("documents")
@Controller("documents")
@ApiBearerAuth("JWT-auth")
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post("generate-upload-url")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Generate presigned URL for document upload",
    description: "Creates a document record and returns a temporary URL (valid for 15 minutes) to upload a file to Firebase Storage",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Presigned URL generated successfully",
    type: GenerateUploadUrlResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid request parameters",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Student not found",
  })
  async getUploadUrl(
    @Body() dto: GenerateUploadUrlRequestDto
  ): Promise<GenerateUploadUrlResponseDTO> {
    return await this.documentService.getPresignedUploadUrl(dto);
  }
  @Post("confirm-upload")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Confirm document upload completion",
    description: "Verifies that the file was successfully uploaded to Firebase Storage and updates the document status to COMPLETED",
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Document upload confirmed successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid document ID format",
    content: {
      "application/json": {
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ["fileId must be a UUID"],
          error: "Bad Request",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Document not found in database or file not found in Firebase Storage",
    content: {
      "application/json": {
        examples: {
          documentNotFound: {
            summary: "Document not found in database",
            value: {
              statusCode: HttpStatus.NOT_FOUND,
              message: 'Document with ID "550e8400-e29b-41d4-a716-446655440000" could not be found.',
              error: "Not Found",
            },
          },
          fileNotInStorage: {
            summary: "File not found in Firebase Storage",
            value: {
              statusCode: HttpStatus.NOT_FOUND,
              message: "The requested document could not be found in Firebase Storage.",
              error: "Not Found",
            },
          },
        },
      },
    },
  })
  async confirmUpload(@Body() dto: ConfirmUploadRequestDto): Promise<void> {
    await this.documentService.confirmUpload(dto);
  }
  @Get("student/:studentId")
  @ApiOperation({
    summary: "Get all documents for a student",
    description: "Retrieves all documents belonging to a specific student by their student ID",
  })
  @ApiParam({
    name: "studentId",
    description: "ID of the student",
    example: 123,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Documents retrieved successfully",
    type: [DocumentResponseDto],
    content: {
      "application/json": {
        example: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            studentId: 123,
            originalName: "student-report.pdf",
            contentType: "application/pdf",
            description: "Student progress report for Q1 2024",
            createdAt: "2024-11-07T12:00:00Z",
            url: "https://storage.googleapis.com/your-bucket/documents/student-123/550e8400-report.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=..."
          },
          {
            id: "660e8400-e29b-41d4-a716-446655440001",
            studentId: 123,
            originalName: "profile-photo.jpg",
            contentType: "image/jpeg",
            description: "Student profile photo",
            createdAt: "2024-11-06T10:30:00Z",
            url: "https://storage.googleapis.com/your-bucket/documents/student-123/550e8400-report.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=..."
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid student ID format",
    content: {
      "application/json": {
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Validation failed (numeric string is expected)",
          error: "Bad Request",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Student not found",
    content: {
      "application/json": {
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Student not found",
          error: "Not Found",
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async getDocumentsByStudentId(
    @Param("studentId", ParseIntPipe) studentId: number
  ): Promise<DocumentResponseDto[]> {
    return await this.documentService.getDocumentsByStudentId(studentId);
  }
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete a document",
    description: "Deletes a document record from the database and removes the associated file from Firebase Storage",
  })
  @ApiParam({
    name: "id",
    description: "Unique identifier of the document to delete",
    example: "550e8400-e29b-41d4-a716-446655440000",
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Document and file successfully deleted",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Document file could not be deleted from Firebase Storage",
    content: {
      "application/json": {
        example: {
          statusCode: 400,
          message: "Document couldn't be deleted",
          error: "Bad Request",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Document not found",
    content: {
      "application/json": {
        example: {
          statusCode: 404,
          message: "Document not found",
          error: "Not Found",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized - Invalid or missing JWT token",
    content: {
      "application/json": {
        example: {
          statusCode: 401,
          message: "Unauthorized",
        },
      },
    },
  })
  async deleteDocument(@Param("id") id: string): Promise<void> {
    await this.documentService.deleteDocument(id);
  }
}