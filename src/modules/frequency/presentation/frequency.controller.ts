import { Controller, Get, Param, ParseIntPipe, Body, Patch, HttpCode, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FrequencyService } from "../application/frequency.service";
import { UserClassesResponseDTO, StudentGeneralAttendanceResponseDTO, UpdateGeneralAttendanceRequestDTO, StudentListByClassAndDateResponseDTO} from "../application/frequency.dtos";
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
    async updateGeneralAttendance(@Body() updateDto: UpdateGeneralAttendanceRequestDTO): Promise<boolean>{
        return await this.frequencyService.updateGeneralAttendance(updateDto);
    }
    @Get("class-attendance")
    @ApiOperation({
    summary: "Get attendance list for a specific class and date",
    description: "Retrieves the attendance records for all students in a specific class on a given date, including attendance percentages and statuses."
    })
    @ApiQuery({ 
    name: 'classId', 
    type: Number, 
    example: 2,
    description: "The unique identifier of the class",
    required: true 
    })
    @ApiQuery({ 
    name: 'date', 
    type: String, 
    example: '2025-09-11',
    description: "The date of the attendance record in YYYY-MM-DD format",
    required: true 
    })
    @ApiResponse({
    status: 200,
    description: "Successfully retrieved the class attendance list",
    type: StudentListByClassAndDateResponseDTO
    })
    @ApiResponse({ 
    status: 400, 
    description: "Invalid request parameters (classId must be a number, date must be a valid date)" 
    })
    @ApiResponse({ 
    status: 500, 
    description: "An unexpected internal server error occurred" 
    })
    async getAttendanceList(
        @Query('classId', ParseIntPipe) classId: number,
        @Query('date', CustomParseDatePipe) date: Date
    ): Promise<StudentListByClassAndDateResponseDTO> {
    return await this.frequencyService.getAttendanceListByClassAndDate(date, classId);
    }
}