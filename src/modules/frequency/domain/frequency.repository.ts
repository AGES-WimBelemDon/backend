import { Frequency } from "./frequency.entity";
export const FREQUENCY_REPOSITORY_TOKEN = "IFrequencyRepository";
export interface IFrequencyRepository{
    deleteManyByStudentAndClassAndDate(frequencies: Frequency[]): Promise<boolean>;
    upsert(frequency: Frequency): Promise<Frequency>;
    getByClassIdAnDate(classId: number, date: Date) : Promise<Frequency[]>;
    createMany(frequencies: Frequency[]): Promise<boolean>;
}