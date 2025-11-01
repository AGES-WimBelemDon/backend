import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Activity } from "../domain/activity.entity";
import { IActivityRepository } from "../domain/activity-repository.interface";
import { ActivityMapper } from "./activity.mapper";

@Injectable()
export class PrismaActivityRepository implements IActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(activity: Activity): Promise<Activity> {
    const created = await this.prisma.activity.create({
      data: ActivityMapper.toPersistence(activity),
    });
    return ActivityMapper.toDomain(created);
  }

  async findAll(): Promise<Activity[]> {
    const activities = await this.prisma.activity.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return activities.map(ActivityMapper.toDomain);
  }

  async findById(id: number): Promise<Activity | null> {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
    });
    return activity ? ActivityMapper.toDomain(activity) : null;
  }

  async findByName(name: string): Promise<Activity | null> {
    const activity = await this.prisma.activity.findUnique({
      where: { name },
    });
    return activity ? ActivityMapper.toDomain(activity) : null;
  }

  async update(activity: Activity): Promise<Activity> {
    const activityId = activity.getId();
    if (!activityId) {
      throw new InternalServerErrorException(
        "Cannot update an activity without an identifier.",
      );
    }

    const updated = await this.prisma.activity.update({
      where: { id: activityId },
      data: {
        name: activity.getName(),
      },
    });
    return ActivityMapper.toDomain(updated);
  }
}
