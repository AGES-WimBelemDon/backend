import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FirebaseService } from "src/modules/firebase/application/firebase.service";
import { GenerateUploadUrlRequestDto } from "./dto/generate-upload-url.request.dto";
import { StudentService } from "src/modules/student/application/student.service";
import { Document } from "../domain/document.entity";
import { DOCUMENT_REPOSITORY_TOKEN, IDocumentRepository } from "../domain/document.repository";
import { v4 as uuidv4 } from "uuid";
import { GenerateUploadUrlResponseDTO } from "./dto/generate-upload-url.response.dto";
@Injectable()
export class DocumentService {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly studentService: StudentService,
        @Inject(DOCUMENT_REPOSITORY_TOKEN)
        private readonly userRepository: IDocumentRepository,
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
        await this.userRepository.create(newDocument);
        return {
            url: url,
            documentId: documentId
        } 
    }
}

