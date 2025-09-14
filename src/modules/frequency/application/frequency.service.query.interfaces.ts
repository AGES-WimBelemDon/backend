import {
  StudentClassAttendanceItemDTO,
  StudentGeneralAttendanceResponseDTO,
  UserClassesDTO,
} from "./frequency.dtos";

export const FREQUENCY_QUERIES_TOKEN = "IFrequencyQueries";
export interface IFrequencyQueries {
  getMyClasses(userId: number): Promise<UserClassesDTO[]>;
  getGeneralAttendance(
    date: Date,
  ): Promise<StudentGeneralAttendanceResponseDTO[]>;
  getStudentByClassAndDateAttendanceList(classId: number, date: Date): Promise<StudentClassAttendanceItemDTO[]>;
}
