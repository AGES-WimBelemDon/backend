import { Controller, Get, Param, ParseIntPipe, Body, Patch, HttpCode } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FrequencyService } from "../application/frequency.service";
import { UserClassesResponseDTO, StudentGeneralAttendanceResponseDTO, UpdateGeneralAttendanceRequestDTO} from "../application/frequency.dtos";
import { CustomParseDatePipe } from "src/common/pipes/CustomParseDatePipe";

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
        type: UserClassesResponseDTO,
    })
    @ApiResponse({ status: 404, description: "User with the specified ID was not found." })
    @ApiResponse({ status: 500, description: "An unexpected internal server error occurred." })
    async getUserClasses(@Param("userId", ParseIntPipe) userId: number):Promise<UserClassesResponseDTO>{
        return await this.frequencyService.getUserClasses(userId);
    }
    @Get("general-attendance/:date")
    @ApiOperation({
        summary: "Get general attendance list for all active students",
        description: "Retrieves the general attendance list of all active students"
    })
    @ApiParam({
        name: "date",
        type: Date,
        description: "The date of the general attendance",
        example: "2025-09-11",
    })
    @ApiResponse({
        status: 200,
        description: "Successfully retrieved the general attendance list",
        type: [StudentGeneralAttendanceResponseDTO],
    })
    async getGeneralAttendance(@Param("date", CustomParseDatePipe) date: Date): Promise<StudentGeneralAttendanceResponseDTO[]>{
        const studentList =  await this.frequencyService.getGeneralAttendance(date)
        return studentList;
    }
    @Patch("general-attendance/")
    @HttpCode(204)
    @ApiResponse({
        status: 204,
        description: "Successfully updated the general attendance list"
    })
    async updateGeneralAttendance(@Body() updateDto: UpdateGeneralAttendanceRequestDTO): Promise<null>{
        await this.frequencyService.updateGeneralAttendance(updateDto);
        return null;
    }
}