import { UserClassesDTO } from "./frequency.dtos";

export const FREQUENCY_QUERIES_TOKEN = "IFrequencyQueries";
export interface IFrequencyQueries{
    getMyClasses(userId: number): Promise<UserClassesDTO[]>;
}