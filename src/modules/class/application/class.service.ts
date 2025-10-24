import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  IClassRepository,
  CLASS_REPOSITORY_TOKEN,
} from "../domain/class-repository.interface";
import { CreateClassDTO } from "./create-class.dto";
import { Class } from "../domain/class.entity";
import { StudentService } from "src/modules/student/application/student.service";
import { ClassResponseDTO } from "./class-response.dto";
import { UpdateClassDTO } from "./update-class.dto";
import { ClassMapper } from "../infrastructure/class.mapper";
import { CLASS_SCHEDULE_REPOSITORY_TOKEN, IClassScheduleRepository } from "../domain/class-schedule-repository.interface";
import { ClassSchedule } from "../domain/class-schedule";
import { DayOfWeek } from "@prisma/client";

@Injectable()
export class ClassService {
  constructor(
    @Inject(CLASS_REPOSITORY_TOKEN)
    private readonly classRepository: IClassRepository,
    @Inject(CLASS_SCHEDULE_REPOSITORY_TOKEN)
    private readonly scheduleRepository: IClassScheduleRepository
  ) {}

  async createClass(createClassDto: CreateClassDTO): Promise<Class>  {
    if (createClassDto.teacherIds && createClassDto.teacherIds.length > 0) {
      // TODO: Implement validation when UserService is created
      console.warn(
        " WARNING: Teacher ID validation is currently bypassed due to missing UserService"
      );

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

    if (!createClassDto.levelId) {
      //IMPLEMENTAR A VERIFICAçÂO COM O SERViÇO JÁ IMPLEMENTADO
      throw new NotFoundException(`WARNING: Level ID was not found!`);
    }

    if (!createClassDto.activityId) {
      throw new NotFoundException(`WARNING: Activity ID was not found!`);
    }

    const classEntity = new Class({
      ...createClassDto,
      startTime: new Date(`1970-01-01T${createClassDto.startTime}`),
      endTime: new Date(`1970-01-01T${createClassDto.endTime}`),
      schedules: [],
    });

// const daysEnum: DayOfWeek[] = createClassDto.dayOfWeek
//     .map(day => DayOfWeek[day as keyof typeof DayOfWeek])
//     .filter(Boolean) as DayOfWeek[];

  // Cria a entidade de domíni

  // Usa os enums convertidos, não as strings originais
  const createdClass = await this.classRepository.create(
    classEntity,
    DayOfWeek["SEGUNDA"],
    createClassDto.teacherIds || []
  );

  // Retorna a entidade de domínio criada
  return createdClass;
}
  async findAll(activityId?: number, levelId?: number, state?: string): Promise<Class[]> {
    var _classes = await this.classRepository.findAll(activityId, levelId, state);
    if (!_classes) {
      throw new NotFoundException(`There is not classes registered`);
    }
    return _classes;
  }

  async findById(id: number, activityId?: number, levelId?: number, state?: string): Promise<Class> {
    var _class = await this.classRepository.findById(id, activityId, levelId, state);
    if (!_class) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return _class
  }

  async update(id: number, updateClassDto: UpdateClassDTO){
    var _class = await this.classRepository.findById(id);
    if (!_class) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    var allSchedules: ClassSchedule[] = await this.scheduleRepository.findAll();

    const commonSchedules = allSchedules.filter(s => updateClassDto.schedulesIds.includes(s.id))
    const classEntity = ClassMapper.updateToDomain(_class, updateClassDto);
    classEntity.setSchedules(commonSchedules)
    
    var updatedClass = await this.classRepository.update(id,classEntity);

    return updatedClass
  }

  async deleteClass(id: number) {
    const _class = this.findById(id);
    if (!_class) {
      throw new InternalServerErrorException();
    }
    return await this.classRepository.delete(id);
  }
}
