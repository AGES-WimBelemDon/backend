import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FrequencyService } from "../application/frequency.service";
import { ResponseGetMyClassesDTO} from "../application/frequency.dtos";

@Controller("frequency")
@ApiTags("frequencyResource")
export class FrequencyConstroller{
    constructor(private frequencyService: FrequencyService ){}
    
    @Get("available-classes/:userId")
    @ApiOperation({
    summary: "Get available classes for a user",
    description: "Retrieves a list of all classes a specific user is assigned to.",
  })
    @ApiParam({
        name: "userId",
        type: "number",
        description: "The unique identifier of the user",
        example: 2,
    })
    @ApiResponse({
        status: 200,
        description: "Successfully retrieved the list of classes.",
        type: ResponseGetMyClassesDTO,
    })
    @ApiResponse({ status: 404, description: "User with the specified ID was not found." })
    @ApiResponse({ status: 500, description: "An unexpected internal server error occurred." })
    async getUserClasses(@Param("userId", ParseIntPipe) userId: number):Promise<ResponseGetMyClassesDTO>{
        return await this.frequencyService.getUserClasses(userId);
    }
}