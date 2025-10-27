import { Module } from "@nestjs/common";
import { ActivityController } from "./presentation/activity.controller";
import { ActivityService } from "./application/activity.service";
import { ACTIVITY_REPOSITORY_TOKEN } from "./domain/activity-repository.interface";
import { PrismaActivityRepository } from "./infrastructure/activity.repository";

@Module({
  controllers: [ActivityController],
  providers: [
    ActivityService,
    {
      provide: ACTIVITY_REPOSITORY_TOKEN,
      useClass: PrismaActivityRepository,
    },
  ],
  exports: [ActivityService, ACTIVITY_REPOSITORY_TOKEN],
})
export class ActivityModule {}
