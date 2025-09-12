import { StudentGeneralAttendanceResponseDTO, UserClassesDTO } from "../application/frequency.dtos";
import { FrequencyStatus } from "../domain/frequency.entity";


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
    }
    static toStudentGeneralAttendanceDTO(prismaClass: PrismaStudentGeneralFrequency): StudentGeneralAttendanceResponseDTO {
        const formatDate = (date: Date): string|null => {
            if (!date) return null;
            return date.toISOString().split("T")[0]; 
            };
        const studentRef =  {
            studentId: prismaClass.studentid,
            fullName: prismaClass.fullname,
            date: formatDate(prismaClass.date),
            generalAttendanceAllowed: prismaClass.generalattendanceallowed==="true"?true:false,
            status: prismaClass.status,
    };
        return studentRef;
    }
}