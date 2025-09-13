import { PrismaService } from "src/prisma/prisma.service";
import { Frequency } from "../domain/frequency.entity";
import { IFrequencyRepository } from "../domain/frequency.repository";
import { Injectable } from "@nestjs/common";
import { FrequencyMapper } from "./frequency.mapper";

@Injectable()
export class PrismaFrequencyRepository implements IFrequencyRepository {
    constructor(private readonly prisma: PrismaService) {}
    async deleteManyByStudentAndClassAndDate(frequencies: Frequency[]): Promise<boolean> {
        if(frequencies.length==0){
          return false;
        }
        const whereConditions = frequencies.map(frequency => ({
            studentId: frequency.getStudentId(),
            classId: frequency.getClassId(),
            date: frequency.getDate(),
        }));

        await this.prisma.frequency.deleteMany({
            where: {
            OR: whereConditions
            }
        });
        return true;
        }
    async upsert(frequency: Frequency): Promise<Frequency> {
      const existing = await this.prisma.frequency.findFirst({
        where: {
          studentId: frequency.getStudentId(),
          classId: frequency.getClassId(),
          date: frequency.getDate(),
        },
      });
      const result = existing 
        ? await this.prisma.frequency.update({
            where: { id: existing.id },
            data: {
              status: frequency.getStatus(),
              notes: frequency.getNotes(),
            },
          })
        : await this.prisma.frequency.create({
            data: {
              studentId: frequency.getStudentId(),
              classId: frequency.getClassId(),
              date: frequency.getDate(),
              status: frequency.getStatus(),
              notes: frequency.getNotes(),
            },
          });
      return FrequencyMapper.toDomain(result);
}
}