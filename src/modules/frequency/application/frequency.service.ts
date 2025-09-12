import { Inject, Injectable } from "@nestjs/common";
import { FREQUENCY_QUERIES_TOKEN, IFrequencyQueries } from "./frequency.service.query.interfaces";
import { UserClassesResponseDTO, StudentGeneralAttendanceResponseDTO } from "./frequency.dtos";

@Injectable()
export class FrequencyService{
    @Inject(FREQUENCY_QUERIES_TOKEN)
    private readonly frequencyQueryService: IFrequencyQueries;
    public async getUserClasses(userId: number): Promise<UserClassesResponseDTO>{
        var userClasses = await this.frequencyQueryService.getMyClasses(userId);
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
        })
        return {
            classes : userClasses
        };
    }
    public async getGeneralAttendance(date: Date): Promise<StudentGeneralAttendanceResponseDTO[]>{
        const studentList = await this.frequencyQueryService.getGeneralAttendance(date);
        return studentList;
    }
}