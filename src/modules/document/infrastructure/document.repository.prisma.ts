import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IDocumentRepository } from "../domain/document.repository";
import { Document } from "../domain/document.entity";
import { DocumentMapper } from "./document.mapper";

@Injectable()
export class PrismaDocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(document: Document): Promise<void> {
    const data = DocumentMapper.toPersistence(document);

    await this.prisma.document.create({
      data,
    });
  }
}