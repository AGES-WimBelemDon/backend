import { Frequency } from "./frequency.entity";
export const FREQUENCY_REPOSITORY_TOKEN = "IFrequencyRepository";
export interface IFrequencyRepository{
    deleteManyByStudentAndClassAndDate(frequencies: Frequency[]): Promise<boolean>;
}