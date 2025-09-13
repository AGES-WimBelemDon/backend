import { PrismaService } from "src/prisma/prisma.service";
import { Frequency } from "../domain/frequency.entity";
import { IFrequencyRepository } from "../domain/frequency.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaFrequencyRepository implements IFrequencyRepository {
    constructor(private readonly prisma: PrismaService) {}
    async deleteManyByStudentAndClassAndDate(frequencies: Frequency[]): Promise<boolean> {
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
}