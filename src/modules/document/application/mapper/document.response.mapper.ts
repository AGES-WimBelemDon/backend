import { DocumentResponseDto } from "../dto/document.response.dto";
import { Document } from "../../domain/document.entity";
export class DocumentResponseMapper {
  static toDTO(document: Document): DocumentResponseDto {
    const dto = new DocumentResponseDto();
    
    dto.id = document.getId();
    dto.studentId = document.getStudentId();
    dto.originalName = document.getOriginalName();
    dto.contentType = document.getContentType();
    dto.description = document.getDescription() ?? "";
    dto.createdAt = document.getCreatedAt();
    
    return dto;
  }

  static toDTOList(documents: Document[]): DocumentResponseDto[] {
    return documents.map((document) => this.toDTO(document));
  }
}