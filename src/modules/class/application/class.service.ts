import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CreateClassDTO } from "./dtos/create-class.request.dto";
import { LevelService } from "src/modules/level/application/level.service";
import { ClassSchedule } from "../domain/class-schedule";
import { Class } from "../domain/class.entity";
import {
  CLASS_QUERIES_TOKEN,
  IClassQueries,
} from "./class.service.query.interfaces";
import { Teacher } from "../domain/teacher";
import {
  CLASS_REPOSITORY_TOKEN,
  IClassRepository,
} from "../domain/class.repository.interface";
import { ClassQueryFilters, ClassResponseDTO } from "./dtos";
import { ClassResponseMapper } from "./mappers";
import { ClassState } from "src/common/enums/domain.enums";

@Injectable()
export class ClassService {
  constructor(
    private readonly levelService: LevelService,

    @Inject(CLASS_QUERIES_TOKEN)
    private readonly classQueriesService: IClassQueries,
    @Inject(CLASS_REPOSITORY_TOKEN)
    private readonly classRepository: IClassRepository,
  ) {}

  async createClass(createClassDto: CreateClassDTO): Promise<ClassResponseDTO> {
    await this.levelService.getById(createClassDto.levelId);
    // await this.activityService.getById(createClassDto.activityId);
    let teachers: Teacher[] = [];
    if (createClassDto.teacherIds?.length) {
      teachers = await this.classQueriesService.getManyByTeacherId(
        createClassDto.teacherIds,
      );
      if (teachers.length !== createClassDto.teacherIds.length) {
        throw new BadRequestException(
          "Cannot create class: an invalid teacherId was passed",
        );
      }
    }
    if (createClassDto.isRecurrent && !createClassDto.dayOfWeek?.length) {
      throw new BadRequestException(
        "Cannot create recurrent class: dayOfWeek array cannot be empty when isRecurrent is true",
      );
    }
    let schedules: ClassSchedule[] = [];
    if (createClassDto.dayOfWeek?.length) {
      schedules = createClassDto.dayOfWeek.map(
        (day) => new ClassSchedule({ dayOfWeek: day }),
      );
    }
    if (
      !this.isValidTime(createClassDto.startTime) ||
      !this.isValidTime(createClassDto.endTime)
    ) {
      throw new BadRequestException(
        "Cannot create class: invalid start or end time provided.",
      );
    }
    const classEntity = new Class({
      ...createClassDto,
      state: ClassState.ATIVA,
      startTime: new Date(`1970-01-01T${createClassDto.startTime}`),
      endTime: new Date(`1970-01-01T${createClassDto.endTime}`),
      schedules: schedules,
      teachers: teachers,
    });
    const resp = await this.classRepository.create(classEntity);
    return ClassResponseMapper.toDTO(resp);
  }

  private isValidTime(time: string): boolean {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return (
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59 &&
      seconds >= 0 &&
      seconds <= 59
    );
  }
  async findClasses(
      filters: ClassQueryFilters,
    ): Promise<ClassResponseDTO[]> {
      const classes = await this.classRepository.findClasses(filters);
      return classes.map(classObj => ClassResponseMapper.toDTO(classObj));
    }
  async findMyClasses(
    userId: number,
    filters: ClassQueryFilters
  ): Promise<ClassResponseDTO[]>{
    const classes = await this.classRepository.findMyClasses(userId,filters);
    return classes.map(classObj => ClassResponseMapper.toDTO(classObj));
  }
}
