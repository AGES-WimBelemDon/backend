import { Class } from "./class.entity";

export const CLASS_REPOSITORY_TOKEN = "IClassRepository";

export interface IClassRepository {
  create(classObj: Class): Promise<Class>;
}
