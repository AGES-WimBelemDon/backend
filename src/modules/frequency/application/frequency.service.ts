import { Inject, Injectable } from "@nestjs/common";
import { FREQUENCY_QUERIES_TOKEN, IFrequencyQueries } from "./frequency.service.query.interfaces";
import { ResponseGetMyClassesDTO } from "./frequency.dtos";

@Injectable()
export class FrequencyService{
    @Inject(FREQUENCY_QUERIES_TOKEN)
    private readonly frequencyQueryService: IFrequencyQueries;
    public async getUserClasses(userId: number): Promise<ResponseGetMyClassesDTO>{
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
}