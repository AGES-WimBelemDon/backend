import { Injectable } from "@nestjs/common";
import { IClassScheduleRepository } from "../domain/class-schedule-repository.interface";
import { ClassSchedule as Schedule } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ClassScheduleMapper } from "./class-schedule.mapper";

@Injectable()
export class ClassScheduleRepository implements IClassScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}
    async findAll(): Promise<Schedule[] | []> {
        const _schedules = await this.prisma.classSchedule.findMany();

        return _schedules.map(ClassScheduleMapper.toDomain)
    }
    async findById(id: number): Promise<Schedule | null> {
        const _schedule = await this.prisma.classSchedule.findFirst(
            {where: {
                id: id,
            }}
        )
        
        if(_schedule == null){
            return null;
        }

        return ClassScheduleMapper.toDomain(_schedule)
    }

}