
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IClassRepository } from "../domain/class-repository.interface";
import { Class } from "../domain/class.entity";
import { ClassMapper } from "./class.mapper";

@Injectable()
export class ClassRepository implements IClassRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(classEntity: Class): Promise<Class> {
        const prismaClass = await this.prisma.class.create({
            data: {
                name: classEntity.getName(),
                activityId: classEntity.getActivityId(),
                levelId: classEntity.getLevelId(),
                state: classEntity.getState(),
            },
        });

        return ClassMapper.toDomain(prismaClass);
    }

    async findById(id: number): Promise<Class | null> {
        const prismaClass = await this.prisma.class.findUnique({
            where: { id },
        });

        if (!prismaClass) {
            return null;
        }

        return ClassMapper.toDomain(prismaClass);
    }

    async findAll(): Promise<Class[]> {
        const prismaClasses = await this.prisma.class.findMany();

        return prismaClasses.map(ClassMapper.toDomain);
    }

    async update(id: number, classData: Partial<Class>): Promise<Class> {
        const prismaClass = await this.prisma.class.update({
            where: { id },
            data: {
                name: classData.name,
                activityId: classData.activityId,
                levelId: classData.levelId,
                state: classData.state,
            },
        });

        return ClassMapper.toDomain(prismaClass);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.class.delete({
            where: { id },
        });
    }
}
