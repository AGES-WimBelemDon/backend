import { StudentGeneralAttendanceDTO, UserClassesDTO } from "../application/frequency.dtos";


type PrismaTeacherClass = {
  id: number;
  name: string;
  state: string;
  level: { name: string } | null;
  activity: { id: number; name: string } | null;
};
export type PrismaStudentGeneralFrequency = {
  studentid:   number;
  frequencyid: null | number,
  fullname:    string;
  date:        Date;
  generalattendanceallowed: "false" | "true";
  status: "PRESENTE" | "AUSENTE";
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
    static toStudentGeneralAttendanceDTO(prismaClass: PrismaStudentGeneralFrequency): StudentGeneralAttendanceDTO {
        const studentRef =  {
            studentId: prismaClass.studentid,
            frequencyId: prismaClass.frequencyid,
            fullName: prismaClass.fullname,
            date: prismaClass.date,
            generalAttendanceAllowed: prismaClass.generalattendanceallowed==="true"?true:false,
            status: prismaClass.status,
    };
        return studentRef;
    }
}