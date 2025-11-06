import { Module } from "@nestjs/common";
import { FirebaseModule } from "../firebase/firebase.module";
import { DocumentController } from "./presentation/document.controller";
import { DocumentService } from "./application/document.service";

@Module({
    imports: [FirebaseModule],
    controllers:[DocumentController],
    providers: [DocumentService]
})
export class DocumentModule{}