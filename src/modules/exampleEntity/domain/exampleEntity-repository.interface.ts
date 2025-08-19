import { ExampleEntity } from "./exampleEntity.entity";
export const EXAMPLE_ENTITY_REPOSITORY_TOKEN = "IExampleEntityRepository";
export interface IExampleEntityRepository {
    findById(id: string): Promise<ExampleEntity | null>;
    findByEmail(email: string): Promise<ExampleEntity | null>;
    findAll(): Promise<ExampleEntity[]>;
    create(data: ExampleEntity): Promise<ExampleEntity>;
    delete(id: string): Promise<void>;}