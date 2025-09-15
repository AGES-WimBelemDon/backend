import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import {
  FREQUENCY_QUERIES_TOKEN,
  IFrequencyQueries,
} from "./frequency.service.query.interfaces";
import {
  UserClassesResponseDTO,
  StudentGeneralAttendanceResponseDTO,
  UpdateGeneralAttendanceRequestDTO,
  UpdateGeneralAttendanceItemDTO,
  StudentListByClassAndDateResponseDTO,
  StudentClassAttendanceItemDTO,
} from "./frequency.dtos";
import { Frequency, FrequencyStatus } from "../domain/frequency.entity";
import { FREQUENCY_REPOSITORY_TOKEN, IFrequencyRepository } from "../domain/frequency.repository";

@Injectable()
export class FrequencyService {
  @Inject(FREQUENCY_QUERIES_TOKEN)
  private readonly frequencyQueryService: IFrequencyQueries;
  @Inject(FREQUENCY_REPOSITORY_TOKEN)
  private readonly frequencyRepository: IFrequencyRepository;

  public async getUserClasses(userId: number): Promise<UserClassesResponseDTO> {
    const userClasses = await this.frequencyQueryService.getMyClasses(userId);
    userClasses.push({
      classId: null,
      className: "Geral",
      classState: "ATIVA",
      levelName: null,
      isGeral: true,
      activity: {
        activityId: null,
        activityName: "Atividade geral",
      },
    });
    return {
      classes: userClasses,
    };
  }
  public async getGeneralAttendance(
    date: Date,
  ): Promise<StudentGeneralAttendanceResponseDTO[]> {
    const studentList =
      await this.frequencyQueryService.getGeneralAttendance(date);
    return studentList;
  }
  public async updateGeneralAttendance(
    array: UpdateGeneralAttendanceRequestDTO,
  ): Promise<boolean> {
    if(!array["updates"]){
      return false;
    };
    var validItems   : UpdateGeneralAttendanceItemDTO[] = array["updates"].filter(item=>item.generalAttendanceAllowed===true);
    var present      : Frequency[] = [];
    var notPresent   : Frequency[] = [];
    const domainItems: Frequency[] = validItems.map(item=>new Frequency({
        id : null,
        studentId: item.studentId,
        classId: null,
        date: item.date,
        status: item.status,
        notes: null
    }));
    for (let index = 0; index < domainItems.length; index++) {
      const element = domainItems[index]
      if(element.getStatus()===FrequencyStatus.PRESENTE){
        present.push(element);
      }else if(element.getStatus()===FrequencyStatus.AUSENTE){
        notPresent.push(element);
      };
    };
    if(notPresent.length){
      await this.frequencyRepository.deleteManyByStudentAndClassAndDate(notPresent);
    }
    for (let index = 0; index < present.length; index++) {
        await this.frequencyRepository.upsert(present[index]); 
      }
    return true;
  }
  public async getAttendanceListByClassAndDate(date: Date, classId: number): Promise<StudentListByClassAndDateResponseDTO>{
    const attendanceList = await this.frequencyQueryService.getStudentByClassAndDateAttendanceList(classId, date);
    return {
      classId : classId,
      date    : date,
      studentList : attendanceList
    };
  }
  public async createAttendanceList(date: Date, classId: number): Promise<StudentListByClassAndDateResponseDTO>{
    const attendanceList = await this.frequencyRepository.getByClassIdAnDate(classId, date);
    if(attendanceList.length>0){
      throw new ConflictException(`Class with ID ${classId} and date ${date.toISOString().split("T")[0]} already was created.`);
    }
    const enrolledStudents = await this.frequencyQueryService.getStudentsByClassId(classId);
    if(enrolledStudents.length===0){
      throw new NotFoundException(`The class with ID ${classId} has no enrolled students or wasn't found.`);
    }
    const frequencies: Frequency[] = [];
    for (let index = 0; index < enrolledStudents.length; index++) {
      const frequency = new Frequency({
        id: null,
        studentId: enrolledStudents[index].id,
        classId: classId,
        date: date,
        status: FrequencyStatus.PRESENTE,
        notes: null
      });
      frequencies.push(frequency);
    };
    const newFrequenciesArray = frequencies.map(frequency=>new Frequency({
        id: null,
        studentId: frequency.getStudentId(),
        classId: null,
        date: frequency.getDate(),
        status: FrequencyStatus.PRESENTE,
        notes: null
    }))
    const wasItDeleted = await this.frequencyRepository.deleteManyByStudentAndClassAndDate(newFrequenciesArray);
    if(!wasItDeleted){
      throw new InternalServerErrorException();
    }
    const wasItCreated = await this.frequencyRepository.createMany(frequencies);
    if(!wasItCreated){
      throw new InternalServerErrorException("The system wasn't able to create a new class attendance");
    }
    return await this.getAttendanceListByClassAndDate(date, classId);
  }
}
