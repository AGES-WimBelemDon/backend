import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateClassDTO } from "./create-class.request.dto";
import { LevelService } from "src/modules/level/application/level.service";
import { ClassSchedule } from "../domain/class-schedule";
import { Class } from "../domain/class.entity";
import { CLASS_QUERIES_TOKEN, IClassQueries } from "./class.service.query.interfaces";
import { Teacher } from "../domain/teacher";

@Injectable()
export class ClassService {
  constructor(
    private readonly levelService: LevelService,
    
    @Inject(CLASS_QUERIES_TOKEN)
    private readonly classQueriesService: IClassQueries
  ) {}

  async createClass(createClassDto: CreateClassDTO): Promise<void>  {
    // await this.levelService.getById(createClassDto.levelId);
    // await this.activityService.getById(createClassDto.activityId);
    var teachers: Teacher[] = []
    if(createClassDto.teacherIds?.length){
        teachers = await this.classQueriesService.getManyByTeacherId(createClassDto.teacherIds);
        if(teachers.length !== createClassDto.teacherIds.length){
            throw new BadRequestException(
                "Cannot create class: an invalid teacherId was passed"
            )
        }
    }
    if(createClassDto.isRecurrent && !createClassDto.dayOfWeek?.length){
        throw new BadRequestException(
            "Cannot create recurrent class: dayOfWeek array cannot be empty when isRecurrent is true"
        )
    };
    var schedules: ClassSchedule[] = [];
    if(createClassDto.dayOfWeek?.length){
        schedules = createClassDto.dayOfWeek.map(
            day => new ClassSchedule({dayOfWeek:day})
        );
    }
    const classEntity = new Class({
      ...createClassDto,
      startTime: new Date(`1970-01-01T${createClassDto.startTime}`),
      endTime: new Date(`1970-01-01T${createClassDto.endTime}`),
      schedules: schedules,
    });

  }
  
}