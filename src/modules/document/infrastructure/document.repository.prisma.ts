import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IDocumentRepository } from "../domain/document.repository";
import { Document } from "../domain/document.entity";
import { DocumentMapper } from "./document.mapper";

@Injectable()
export class PrismaDocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}
  async upload(document: Document): Promise<void> {
    const data = DocumentMapper.toPersistence(document);
    await this.prisma.document.update({
      where : {
        id : data.id
      },
      data : {
        contentType : data.contentType,
        createdAt : data.createdAt,
        description : data.description,
        originalName : data.originalName,
        studentId : data.studentId,
        status: data.status
      }
    })
  }
  async findById(id: string): Promise<Document | null> {
    const document = await this.prisma.document.findFirst({
      where : {
        id : id
      }
    });
    if(!document){
      return document;
    };
    return DocumentMapper.toDomain(document);
  }

  async create(document: Document): Promise<void> {
    const data = DocumentMapper.toPersistence(document);

    await this.prisma.document.create({
      data,
    });
  }
  async delete(id: string): Promise<void> {
    await this.prisma.document.delete({
      where: {
        id: id
      }
    });
  }
}