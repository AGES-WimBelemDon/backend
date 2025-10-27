import { Activity as PrismaActivity } from "@prisma/client";
import { Activity } from "../domain/activity.entity";
import { ActivityResponseDto } from "../application/activity.response.dto";

export class ActivityMapper {
  static toDomain(prismaActivity: PrismaActivity): Activity {
    return new Activity(prismaActivity.id, prismaActivity.name);
  }

  static toPersistence(activity: Activity): { name: string } {
    return {
      name: activity.getName(),
    };
  }

  static toResponse(activity: Activity): ActivityResponseDto {
    return {
      id: activity.getId() ?? -1,
      name: activity.getName(),
    };
  }
}
