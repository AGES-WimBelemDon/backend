import { Document } from "./document.entity";

export const DOCUMENT_REPOSITORY_TOKEN = "IDocumentRepository";
export interface IDocumentRepository{
    create(document: Document): Promise<void>;
}