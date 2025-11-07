import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FirebaseService } from "src/modules/firebase/application/firebase.service";
import { GenerateUploadUrlRequestDto } from "./dto/generate-upload-url.request.dto";
import { StudentService } from "src/modules/student/application/student.service";
import { Document } from "../domain/document.entity";
import { DOCUMENT_REPOSITORY_TOKEN, IDocumentRepository } from "../domain/document.repository";
import { v4 as uuidv4 } from "uuid";
import { GenerateUploadUrlResponseDTO } from "./dto/generate-upload-url.response.dto";
import { ConfirmUploadRequestDto } from "./dto/confirm-upload.request.dto";
import { FileStatus } from "src/common/enums/domain.enums";
@Injectable()
export class DocumentService {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly studentService: StudentService,
        @Inject(DOCUMENT_REPOSITORY_TOKEN)
        private readonly documentRepository: IDocumentRepository,
    ){}
    async getPresignedUploadUrl(dto: GenerateUploadUrlRequestDto): Promise<GenerateUploadUrlResponseDTO>{
        const student = await this.studentService.findById(dto.studentId);
        if(!student){
            throw new NotFoundException("The document couldn't be created")
        }
        const url = await this.firebaseService.getPresignedUploadUrl(dto.originalName, dto.contentType);
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
            createdAt: dto.createdAt
        });
        await this.documentRepository.create(newDocument);
        return {
            url: url,
            documentId: documentId
        } 
    }
    async confirmUpload(dto: ConfirmUploadRequestDto):Promise<void>{
        var document = await this.documentRepository.findById(dto.fileId);
        if(!document){
            throw new NotFoundException(`Document with ID "${dto.fileId}" could not be found. Please verify that the file exists and the ID is correct.`)
        }
        const exists = await this.firebaseService.fileExists(document.getStoragePath());
        if(!true){
            throw new NotFoundException("The requested document could not be found in Firebase Storage.")
        }
        document.setStatus(FileStatus.COMPLETED);
        await this.documentRepository.upload(document);
    }
}

