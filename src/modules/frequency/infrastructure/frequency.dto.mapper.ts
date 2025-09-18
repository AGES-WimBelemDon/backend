import { FrequencyStatus } from "src/common/enums/domain.enums";
import {
    StudentClassAttendanceItemDTO,
    StudentGeneralAttendanceResponseDTO,
    UserClassesDTO
} from "../application/dtos";


type PrismaTeacherClass = {
  id: number;
  name: string;
  state: string;
  level: { name: string } | null;
  activity: { id: number; name: string } | null;
};
export type PrismaStudentGeneralFrequency = {
  studentid:   number;
  fullname:    string;
  date:        Date;
  generalattendanceallowed: "false" | "true";
  status: FrequencyStatus;
}
export type PrismaStudentClassAttendance = {
      frequencyId: number;
      stutendId: number;
      fullName: string;
      attendance: number;
      status: string;
      notes: string | null;
    }
export class FrequencyDTOMapper {
    static toUserClassesDTO(prismaClass: PrismaTeacherClass): UserClassesDTO {
        return {
        classId: prismaClass.id,
        className: prismaClass.name,
        classState: prismaClass.state,
        levelName: prismaClass.level?.name ?? "N/A",
        isGeral: false,
        activity: {
            activityId: prismaClass.activity?.id ?? 0,
            activityName: prismaClass.activity?.name ?? "N/A",
        },
        };
    };
    static toStudentGeneralAttendanceDTO(prismaClass: PrismaStudentGeneralFrequency): StudentGeneralAttendanceResponseDTO {
        const studentRef =  {
            studentId: prismaClass.studentid,
            fullName: prismaClass.fullname,
            generalAttendanceAllowed: prismaClass.generalattendanceallowed==="true"?true:false,
            status: prismaClass.status,
    };
        return studentRef;
    };
    static toStudentClassAttendanceItemDTO(result: PrismaStudentClassAttendance): StudentClassAttendanceItemDTO {
        const formattedAttendance = result.attendance !== null 
        ? (result.attendance * 100).toFixed(2)
        : '0.00';
        return {
            frequencyId: result.frequencyId,
            studentId: result.stutendId,
            studentFullName: result.fullName,
            attendancePercentage: +formattedAttendance,
            status: result.status,
            notes: result.notes,
        };
        }
}