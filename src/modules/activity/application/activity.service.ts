import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  ACTIVITY_REPOSITORY_TOKEN,
  IActivityRepository,
} from "../domain/activity-repository.interface";
import { CreateActivityRequestDto } from "./create-activity.request.dto";
import { Activity } from "../domain/activity.entity";
import { UpdateActivityDto } from "./update-activity.dto";

@Injectable()
export class ActivityService {
  constructor(
    @Inject(ACTIVITY_REPOSITORY_TOKEN)
    private readonly activityRepository: IActivityRepository,
  ) {}

  async create(dto: CreateActivityRequestDto): Promise<Activity> {
    const normalizedName = dto.name.trim();
    if (!normalizedName) {
      throw new BadRequestException("Name is required");
    }

    const existing = await this.activityRepository.findByName(normalizedName);
    if (existing) {
      throw new ConflictException(
        `Activity name '${normalizedName}' is already in use.`,
      );
    }

    const activity = new Activity(undefined, normalizedName);
    return this.activityRepository.create(activity);
  }

  async findAll(): Promise<Activity[]> {
    return this.activityRepository.findAll();
  }

  async update(id: number, dto: UpdateActivityDto): Promise<Activity> {
    const existingActivity = await this.activityRepository.findById(id);
    if (!existingActivity) {
      throw new NotFoundException(`Activity with ID ${id} not found.`);
    }

    const normalizedName = dto.name.trim();
    if (!normalizedName) {
      throw new BadRequestException("Name is required");
    }

    const activityWithSameName =
      await this.activityRepository.findByName(normalizedName);

    if (
      activityWithSameName &&
      activityWithSameName.getId() !== existingActivity.getId()
    ) {
      throw new ConflictException(
        `Activity name '${normalizedName}' is already in use.`,
      );
    }

    existingActivity.setName(normalizedName);

    return this.activityRepository.update(existingActivity);
  }
}
