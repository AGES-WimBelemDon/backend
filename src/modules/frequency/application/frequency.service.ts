import { Inject, Injectable } from "@nestjs/common";
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
}
