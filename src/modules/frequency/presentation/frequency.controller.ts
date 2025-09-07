import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FrequencyService } from "../application/frequency.service";
import { GetMyClassesDTO, UserClassesDTO } from "../application/frequency.dtos";

@Controller("frequency")
@ApiTags("frequencyResource")
export class FrequencyConstroller{
    constructor(private frequencyService: FrequencyService ){}
    @Get("available-classes/:userId")
    async getUserClasses(@Param('userId', ParseIntPipe) userId: number):Promise<GetMyClassesDTO>{
        return await this.frequencyService.getUserClasses(userId);
    }
}