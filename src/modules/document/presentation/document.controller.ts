import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { DocumentService } from "../application/document.service";
import { GenerateUploadUrlRequestDto } from "../application/dto/generate-upload-url.request.dto";
import { GenerateUploadUrlResponseDTO } from "../application/dto/generate-upload-url.response.dto";
import { ConfirmUploadRequestDto } from "../application/dto/confirm-upload.request.dto";

@ApiTags("Documents")
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
}