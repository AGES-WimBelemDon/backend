import { UserClassesDTO } from "../application/frequency.dtos";


type PrismaTeacherClass = {
  id: number;
  name: string;
  state: string;
  level: { name: string } | null;
  activity: { id: number; name: string } | null;
};
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
}