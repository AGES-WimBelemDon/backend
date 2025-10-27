import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
import { UpdateClassDTO } from "./dtos/update-class.request.dto";
import { EnrollmentService } from "src/modules/enrollment/application/enrollment.service";
import { DeleteClassResponseDTO } from "./dtos/delete-class.response.dto";

@Injectable()
export class ClassService {
  constructor(
    private readonly levelService: LevelService,
    private readonly enrollmentService: EnrollmentService,

    @Inject(CLASS_QUERIES_TOKEN)
    private readonly classQueriesService: IClassQueries,
    @Inject(CLASS_REPOSITORY_TOKEN)
    private readonly classRepository: IClassRepository
  ) {}

  async createClass(createClassDto: CreateClassDTO): Promise<ClassResponseDTO> {
    await this.levelService.getById(createClassDto.levelId);
    // await this.activityService.getById(createClassDto.activityId);
    const teachers = await this.validateAndGetTeachers(
      createClassDto.teacherIds
    );
    if (createClassDto.isRecurrent && !createClassDto.dayOfWeek?.length) {
      throw new BadRequestException(
        "Cannot create recurrent class: dayOfWeek array cannot be empty when isRecurrent is true"
      );
    }
    let schedules: ClassSchedule[] = [];
    if (createClassDto.dayOfWeek?.length) {
      schedules = createClassDto.dayOfWeek.map(
        (day) => new ClassSchedule({ dayOfWeek: day })
      );
    }
    if (
      !this.isValidTime(createClassDto.startTime) ||
      !this.isValidTime(createClassDto.endTime)
    ) {
      throw new BadRequestException(
        "Cannot create class: invalid start or end time provided."
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
  async findClasses(filters: ClassQueryFilters): Promise<ClassResponseDTO[]> {
    const classes = await this.classRepository.findClasses(filters);
    return classes.map((classObj) => ClassResponseMapper.toDTO(classObj));
  }
  async findMyClasses(
    userId: number,
    filters: ClassQueryFilters
  ): Promise<ClassResponseDTO[]> {
    const classes = await this.classRepository.findMyClasses(userId, filters);
    return classes.map((classObj) => ClassResponseMapper.toDTO(classObj));
  }
  async findById(classId: number): Promise<Class> {
    const classInstance = await this.classRepository.findById(classId);
    if (!classInstance) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }
    return classInstance;
  }
  async update(
    classId: number,
    dto: UpdateClassDTO
  ): Promise<ClassResponseDTO> {
    const existingClass = await this.findById(classId);
    if (dto.levelId) {
      await this.levelService.getById(dto.levelId);
    }
    const teachers = await this.validateAndGetTeachers(dto.teacherIds);
    //await this.activityService.findById(dto.activityId);
    if (dto.startTime && !this.isValidTime(dto.startTime)) {
      throw new BadRequestException(
        "Cannot update class: invalid start time provided (must be 00:00:00 to 23:59:59)"
      );
    }

    if (dto.endTime && !this.isValidTime(dto.endTime)) {
      throw new BadRequestException(
        "Cannot update class: invalid end time provided (must be 00:00:00 to 23:59:59)"
      );
    }
    if (dto.isRecurrent && !dto.dayOfWeek?.length) {
      throw new BadRequestException(
        "Cannot create recurrent class: dayOfWeek array cannot be empty when isRecurrent is true"
      );
    }
    let schedules: ClassSchedule[] | null | undefined;
    if (dto.dayOfWeek !== undefined) {
      schedules =
        dto.dayOfWeek === null || dto.dayOfWeek.length === 0
          ? null
          : dto.dayOfWeek.map((day) => new ClassSchedule({ dayOfWeek: day }));
    }
    this.updateClassProperties(existingClass, dto, teachers, schedules);
    const classObj = await this.classRepository.update(existingClass);
    return ClassResponseMapper.toDTO(classObj);
  }

  private async validateAndGetTeachers(
    teacherIds?: number[]
  ): Promise<Teacher[]> {
    if (!teacherIds || teacherIds.length === 0) {
      return [];
    }

    const teachers =
      await this.classQueriesService.getManyByTeacherId(teacherIds);

    if (teachers.length !== teacherIds.length) {
      const foundIds = teachers.map((t) => t.id);
      const missingIds = teacherIds.filter((id) => !foundIds.includes(id));

      throw new BadRequestException(
        `Cannot create class: invalid teacher ID(s) provided: ${missingIds.join(", ")}`
      );
    }

    return teachers;
  }
  private updateClassProperties(
    classEntity: Class,
    dto: UpdateClassDTO,
    teachers: Teacher[],
    schedules?: ClassSchedule[] | null
  ): void {
    dto.name !== undefined && classEntity.setName(dto.name);
    dto.activityId !== undefined && classEntity.setActivityId(dto.activityId);
    dto.levelId !== undefined && classEntity.setLevelId(dto.levelId);
    dto.isRecurrent !== undefined &&
      classEntity.setIsRecurrent(dto.isRecurrent);
    dto.startDate !== undefined && classEntity.setStartDate(dto.startDate);
    dto.endDate !== undefined && classEntity.setEndDate(dto.endDate);

    dto.startTime !== undefined &&
      classEntity.setStartTime(new Date(`1970-01-01T${dto.startTime}`));
    dto.endTime !== undefined &&
      classEntity.setEndTime(new Date(`1970-01-01T${dto.endTime}`));

    dto.teacherIds !== undefined && classEntity.setTeachers(teachers);
    schedules !== undefined && classEntity.setSchedules(schedules ?? []);
  }

  async deleteClass(classId: number): Promise<DeleteClassResponseDTO> {
    const classInstance = await this.findById(classId);

    if (classInstance.state === ClassState.INATIVA) {
      return {
        id: classInstance.id!,
        name: classInstance.name,
        state: classInstance.state,
        endDate: classInstance.endDate!.toISOString(),
        message: "Class was already inactive. No changes were applied.",
      };
    }

    const effectiveEndDate = classInstance.endDate ?? new Date();

    classInstance.setState(ClassState.INATIVA);

    if (!classInstance.endDate) {
      classInstance.setEndDate(effectiveEndDate);
    }

    await this.classRepository.update(classInstance);

    await this.enrollmentService.finishEnrollmentsByClassId(
      classId,
      effectiveEndDate
    );

    return {
      id: classInstance.id!,
      name: classInstance.name,
      state: classInstance.state,
      endDate: classInstance.endDate!.toISOString(),
      message: "Class deleted logically. All enrollments have been finalized.",
    };
  }
}
