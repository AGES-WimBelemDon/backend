import { Controller, Post, Body, HttpCode } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { DocumentService } from "../application/document.service";
import { GenerateUrlDto } from "../application/generate-url.dto";

@ApiTags("Documents")
@Controller("documents")
@ApiBearerAuth("JWT-auth")
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post("generate-upload-url")
  @HttpCode(200)
  @ApiOperation({
    summary: "Generate presigned URL for file upload",
    description: "Returns a temporary URL (valid for 15 minutes) to upload a file to Firebase Storage",
  })
  @ApiResponse({
    status: 200,
    description: "Presigned URL generated successfully",
    schema: {
      example: {
        url: "https://storage.googleapis.com/bucket/file.pdf?signature=...",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid file name or content type",
  })
  async getUploadUrl(@Body() dto: GenerateUrlDto) {
    const url = await this.documentService.getPresignedUploadUrl(dto);
    return { url };
  }
}