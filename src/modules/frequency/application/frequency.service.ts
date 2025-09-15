import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import {
  FREQUENCY_QUERIES_TOKEN,
  IFrequencyQueries,
} from "./frequency.service.query.interfaces";
import {
  UserClassesResponseDTO,
  UpdateGeneralAttendanceRequestDTO,
  UpdateGeneralAttendanceItemDTO,
  StudentListByClassAndDateResponseDTO,
  UpdateClassAttendanceRequestDTO,
  GeneralAttendanceResponseDTO,
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
  ): Promise<GeneralAttendanceResponseDTO> {
    const studentList =
      await this.frequencyQueryService.getGeneralAttendance(date);
    return {
      date : date.toISOString().split("T")[0],
      studentList: studentList
    };
  }
  public async updateGeneralAttendance(
    object: UpdateGeneralAttendanceRequestDTO,
  ): Promise<boolean> {
    const date = object.date;
    var validItems   : UpdateGeneralAttendanceItemDTO[] = object["studentList"].filter(item=>item.generalAttendanceAllowed===true);
    var present      : Frequency[] = [];
    var notPresent   : Frequency[] = [];
    const domainItems: Frequency[] = validItems.map(item=>new Frequency({
        id : null,
        studentId: item.studentId,
        classId: null,
        date: date,
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
      date    : date.toISOString().split("T")[0],
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
  };
  
  public async updateAttendanceList(
    updateDto: UpdateClassAttendanceRequestDTO,
  ): Promise<void> {
    const { classId, date, studentList } = updateDto;
    if (studentList.length === 0) {
      throw new BadRequestException('The studentList array cannot be empty.');
    }
    const existingFrequencies = await this.frequencyRepository.getByClassIdAnDate(classId,date);
    if (existingFrequencies.length === 0) {
      throw new BadRequestException(`Attendance list for class ID ${classId} on this date has not been created yet.`);
    }
    const frequencyMap = new Map<number, Frequency>();
    for (const freq of existingFrequencies) {
      frequencyMap.set(freq.getId()??-1, freq);
    }
    const updatePromises: Promise<Frequency>[] = [];
    var presentList: Frequency[] = []
    for (const studentUpdate of studentList) {
      const frequencyToUpdate = frequencyMap.get(studentUpdate.frequencyId);
      if (!frequencyToUpdate) {
        throw new BadRequestException(`Frequency record with ID ${studentUpdate.frequencyId} is not part of this attendance list.`);
      }
      if (studentUpdate.status === FrequencyStatus.PRESENTE) {
        frequencyToUpdate.markPresent();
        presentList.push(frequencyToUpdate);
      } else {
        frequencyToUpdate.markAbsent(studentUpdate.notes ?? undefined);
      }
      updatePromises.push(this.frequencyRepository.upsert(frequencyToUpdate));
    }
    const deleteList = presentList.map(frequency=>
      new Frequency({
        id: null,
        studentId: frequency.getStudentId(),
        classId: null,
        date: frequency.getDate(),
        status: FrequencyStatus.PRESENTE,
        notes: null
      })
    );
    await this.frequencyRepository.deleteManyByStudentAndClassAndDate(deleteList);
    await Promise.all(updatePromises);
  }
}
