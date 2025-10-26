import { ClassQueryFilters } from "../application/dtos";
import { Class } from "./class.entity";

export const CLASS_REPOSITORY_TOKEN = "IClassRepository";

export interface IClassRepository {
  create(classObj: Class): Promise<Class>;
  findClasses(filters: ClassQueryFilters) : Promise<Class[]>;
  findMyClasses(userId: number, filters: ClassQueryFilters) : Promise<Class[]>;
}
