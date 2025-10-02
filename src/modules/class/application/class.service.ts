
import { Injectable, Inject, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { IClassRepository, CLASS_REPOSITORY_TOKEN } from "../domain/class-repository.interface";
import { CreateClassDTO } from "./create-class.dto";
import { Class } from "../domain/class.entity";
import { StudentService } from "src/modules/student/application/student.service";

@Injectable()
export class ClassService {
    constructor(  
        @Inject(CLASS_REPOSITORY_TOKEN)  
        private readonly classRepository: IClassRepository,  
        private readonly studentService: StudentService,  
    ) {}  

    async createClass(createClassDto: CreateClassDTO): Promise<Class> {

        if (createClassDto.studentsIds && createClassDto.studentsIds.length > 0) {  
            for (const studentId of createClassDto.studentsIds) {  
                const student = await this.studentService.findById(studentId);  
                if (!student) {  
                    throw new NotFoundException(`Student with ID ${studentId} not found.`);  
                }  
            }  
        }  

        if (createClassDto.teacherIds && createClassDto.teacherIds.length > 0) {
            // TODO: Implement validation when UserService is created
            console.warn(' WARNING: Teacher ID validation is currently bypassed due to missing UserService');
    
            // for (const teacherId of createClassDto.teacherIds) {
            //     const teacher = await this.userService.findById(teacherId);
            //     if (!teacher) {
            //         throw new NotFoundException(`Teacher (User) with ID ${teacherId} not found.`);
            //     }
            //     
            //     if (teacher.role !== UserRole.TEACHER) {
            //         throw new BadRequestException(`User with ID ${teacherId} is not a teacher.`);
            //     }
            // }
        }

        if(!createClassDto.levelId){
            throw new NotFoundException(`WARNING: Level ID was not found!`)
        }

        if(!createClassDto.activityId){
            throw new NotFoundException(`WARNING: Activity ID was not found!`)
        }

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
        var _class = await this.classRepository.findById(id);  
        if (!_class) {  
        throw new NotFoundException(`Class with ID ${id} not found`);  
        }
        return await this.classRepository.findById(id);
    }


    async deleteClass(id: number){
        const _class = this.findById(id)
        if(!_class){
            throw new InternalServerErrorException()
        }
        return await this.classRepository.delete(id)
    }

}
