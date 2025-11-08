import {
  Document as PrismaDocument,
  Student as PrismaStudent,
} from "@prisma/client";
import { Document } from "../domain/document.entity";
import { StudentMapper } from "src/modules/student/infrastructure/student.mapper";

type PrismaDocumentWithStudent = PrismaDocument & {
  student?: PrismaStudent;
};

export class DocumentMapper {
  static toDomain(prismaDocument: PrismaDocumentWithStudent): Document {
    return new Document({
      id: prismaDocument.id,
      studentId: prismaDocument.studentId,
      originalName: prismaDocument.originalName,
      storagePath: prismaDocument.storagePath,
      contentType: prismaDocument.contentType,
      description: prismaDocument.description ?? undefined,
      createdAt: prismaDocument.createdAt,
      status: prismaDocument.status,
      student: prismaDocument.student
        ? StudentMapper.toDomain(prismaDocument.student)
        : undefined,
    });
  }

  static toPersistence(document: Document) {
    return {
      id: document.getId(),
      studentId: document.getStudentId(),
      originalName: document.getOriginalName(),
      storagePath: document.getStoragePath(),
      contentType: document.getContentType(),
      description: document.getDescription() ?? null,
      createdAt: document.getCreatedAt(),
      status: document.getStatus(),
    };
  }
}
