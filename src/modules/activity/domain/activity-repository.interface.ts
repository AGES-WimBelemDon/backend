import { Activity } from "./activity.entity";

export const ACTIVITY_REPOSITORY_TOKEN = "ActivityRepository";

export interface IActivityRepository {
  create(activity: Activity): Promise<Activity>;
  findAll(): Promise<Activity[]>;
  findById(id: number): Promise<Activity | null>;
  findByName(name: string): Promise<Activity | null>;
  update(activity: Activity): Promise<Activity>;
}
