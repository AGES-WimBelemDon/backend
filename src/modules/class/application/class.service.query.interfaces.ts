import { Teacher } from "../domain/teacher";

export const CLASS_QUERIES_TOKEN = "IClassQueries";
export interface IClassQueries {
  getManyByTeacherId(teachersIds: number[]): Promise<Teacher[]>;
}
