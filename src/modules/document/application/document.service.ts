import { Injectable } from "@nestjs/common";
import { GenerateUrlDto } from "./generate-url.dto";
import { FirebaseService } from "src/modules/firebase/application/firebase.service";
@Injectable()
export class DocumentService {
    constructor(
        private readonly firebaseService: FirebaseService
    ){}
    async getPresignedUploadUrl(dto: GenerateUrlDto){
        return this.firebaseService.getPresignedUploadUrl(dto.fileName, dto.contentType);
    }
}