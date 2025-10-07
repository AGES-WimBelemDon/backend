import { Level } from "./level.entity";

export const LEVEL_REPOSITORY_TOKEN = "ILevelRepositoryInterface";
export interface ILevelRepositoryInterface {
    getById(id: number): Promise<Level | null>;
    findAll(): Promise<Level[]>;
};