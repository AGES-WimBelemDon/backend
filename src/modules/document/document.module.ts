import { Module } from "@nestjs/common";
import { FirebaseModule } from "../firebase/firebase.module";
import { DocumentController } from "./presentation/document.controller";
import { DocumentService } from "./application/document.service";
import { StudentModule } from "../student/student.module";
import { DOCUMENT_REPOSITORY_TOKEN } from "./domain/document.repository";
import { PrismaDocumentRepository } from "./infrastructure/document.repository.prisma";

@Module({
    imports: [FirebaseModule, StudentModule],
    controllers:[DocumentController],
    providers: [
        DocumentService,
        {
            provide: DOCUMENT_REPOSITORY_TOKEN,
            useClass: PrismaDocumentRepository
        }
    ]
})
export class DocumentModule{}