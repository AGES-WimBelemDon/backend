import { Controller, Post, Body, HttpCode } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { DocumentService } from "../application/document.service";
import { GenerateUploadUrlRequestDto } from "../application/dto/generate-upload-url.request.dto";
import { GenerateUploadUrlResponseDTO } from "../application/dto/generate-upload-url.response.dto";

@ApiTags("Documents")
@Controller("documents")
@ApiBearerAuth("JWT-auth")
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post("generate-upload-url")
  @HttpCode(200)
  @ApiOperation({
    summary: "Generate presigned URL for document upload",
    description: "Creates a document record and returns a temporary URL (valid for 15 minutes) to upload a file to Firebase Storage",
  })
  @ApiResponse({
    status: 200,
    description: "Presigned URL generated successfully",
    type: GenerateUploadUrlResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request parameters",
  })
  @ApiResponse({
    status: 404,
    description: "Student not found",
  })
  async getUploadUrl(
    @Body() dto: GenerateUploadUrlRequestDto
  ): Promise<GenerateUploadUrlResponseDTO> {
    return await this.documentService.getPresignedUploadUrl(dto);
  }
}