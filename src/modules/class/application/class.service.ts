
import { Injectable, Inject } from "@nestjs/common";
import { IClassRepository, CLASS_REPOSITORY_TOKEN } from "../domain/class-repository.interface";
import { CreateClassDTO } from "./create-class.dto";
import { Class } from "../domain/class.entity";

@Injectable()
export class ClassService {
    constructor(
        @Inject(CLASS_REPOSITORY_TOKEN)
        private readonly classRepository: IClassRepository,
    ) {}

    async createClass(createClassDto: CreateClassDTO): Promise<Class> {
        const classEntity = new Class({
            name: createClassDto.name,
            activityId: createClassDto.activityId,
            levelId: createClassDto.levelId,
            state: createClassDto.state,
            studentsIds: createClassDto.studentsIds || [],
            teacherIds: createClassDto.teacherIds || [],
        });

        return await this.classRepository.create(classEntity);
    }

    async findById(id: number): Promise<Class | null> {
        return await this.classRepository.findById(id);
    }

    async findAll(): Promise<Class[]> {
        return await this.classRepository.findAll();
    }

    async updateClass(id: number, body: Partial<Class>) {
        return await this.classRepository.update(id, body)
    }

    async deleteClass(id: number){
        return await this.classRepository.delete(id)
    }

}
