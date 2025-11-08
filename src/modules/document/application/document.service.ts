import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { FirebaseService } from "src/modules/firebase/application/firebase.service";
import { GenerateUploadUrlRequestDto } from "./dto/generate-upload-url.request.dto";
import { StudentService } from "src/modules/student/application/student.service";
import { Document } from "../domain/document.entity";
import {
  DOCUMENT_REPOSITORY_TOKEN,
  IDocumentRepository,
} from "../domain/document.repository";
import { v4 as uuidv4 } from "uuid";
import { GenerateUploadUrlResponseDTO } from "./dto/generate-upload-url.response.dto";
import { ConfirmUploadRequestDto } from "./dto/confirm-upload.request.dto";
import { FileStatus } from "src/common/enums/domain.enums";
import { DocumentResponseDto } from "./dto/document.response.dto";
import { DocumentResponseMapper } from "./mapper/document.response.mapper";
import { Cron, CronExpression } from "@nestjs/schedule";
import path from "path";
@Injectable()
export class DocumentService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly studentService: StudentService,
    @Inject(DOCUMENT_REPOSITORY_TOKEN)
    private readonly documentRepository: IDocumentRepository,
  ) {}
  async getPresignedUploadUrl(
    dto: GenerateUploadUrlRequestDto,
  ): Promise<GenerateUploadUrlResponseDTO> {
    const student = await this.studentService.findById(dto.studentId);
    if (!student) {
      throw new NotFoundException("The document couldn't be created");
    }
    const url = await this.firebaseService.getPresignedUploadUrl(
      dto.originalName,
      dto.contentType,
    );
    const path = require("path");
    const extension = path.extname(dto.originalName);
    const documentId = uuidv4();
    const userId = `user${dto.studentId}`;
    const storagePath = `${userId}/${documentId}${extension}`;
    const newDocument = new Document({
      id: documentId,
      studentId: dto.studentId,
      originalName: dto.originalName,
      storagePath: storagePath,
      contentType: dto.contentType,
      description: dto.description,
      createdAt: dto.createdAt,
    });
    await this.documentRepository.create(newDocument);
    return {
      url: url,
      documentId: documentId,
    };
  }
  async confirmUpload(dto: ConfirmUploadRequestDto): Promise<void> {
    const document = await this.documentRepository.findById(dto.fileId);
    if (!document) {
      throw new NotFoundException(
        `Document with ID "${dto.fileId}" could not be found. Please verify that the file exists and the ID is correct.`,
      );
    }
    const exists = await this.firebaseService.fileExists(
      document.getStoragePath(),
    );
    if (!exists) {
      throw new NotFoundException(
        "The requested document could not be found in Firebase Storage.",
      );
    }
    document.setStatus(FileStatus.COMPLETED);
    await this.documentRepository.upload(document);
  }
  async getDocumentsByStudentId(
    studentId: number,
  ): Promise<DocumentResponseDto[]> {
    const student = await this.studentService.findById(studentId);
    if (!student) {
      throw new NotFoundException("Student not found");
    }
    const completeDocumentList =
      await this.documentRepository.getDocumentsByStudentId(studentId);
    const completedDocuments = completeDocumentList.filter(
      (document) => document.getStatus() === FileStatus.COMPLETED,
    );
    const dtoPromises = completedDocuments.map((doc) =>
      this.toDocumentResponseWithUrl(doc),
    );
    const dtos = await Promise.all(dtoPromises);
    return dtos.filter((dto): dto is DocumentResponseDto => dto !== null);
  }
  async toDocumentResponseWithUrl(
    document: Document,
  ): Promise<DocumentResponseDto | null> {
    const storagePath = document.getStoragePath();
    const url = await this.firebaseService.getPresignedReadUrl(storagePath);
    if (!url) {
      return null;
    }
    return DocumentResponseMapper.toDTO(document, url);
  }
  async deleteDocument(id: string): Promise<void> {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new NotFoundException("Document not found");
    }
    const wasFirebaseFileDeleted = await this.firebaseService.deleteFile(
      document.getStoragePath(),
    );
    if (!wasFirebaseFileDeleted) {
      throw new BadRequestException("Document couldn't be deleted");
    }
    await this.documentRepository.delete(id);
  }
  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  async cleanUpPendingFiles(): Promise<void> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const pendingDocuments =
      await this.documentRepository.getPendingDocuments();
    const documentsToBeRemoved = pendingDocuments.filter((document) =>
      this.isDocumentOutdated(document, twentyFourHoursAgo),
    );
    if (documentsToBeRemoved.length === 0) {
      return;
    }
    const idList = documentsToBeRemoved.map((document) => document.getId());
    const storagePathList = documentsToBeRemoved.map((document) =>
      document.getStoragePath(),
    );
    const deletedDocumentsPromises = storagePathList.map((storagePath) =>
      this.firebaseService.deleteFile(storagePath),
    );
    await Promise.allSettled(deletedDocumentsPromises);
    await this.documentRepository.deleteMany(idList);
  }
  isDocumentOutdated(doc: Document, pastTime: Date): boolean {
    if (
      doc.getStatus() === FileStatus.PENDING &&
      doc.getCreatedAt() < pastTime
    ) {
      return true;
    }
    return false;
  }
}
