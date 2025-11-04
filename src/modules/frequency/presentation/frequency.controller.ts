import { Controller, Get, Param, ParseIntPipe, Body, Patch, HttpCode, Query, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FrequencyService } from "../application/frequency.service";
import {
    UserClassesResponseDTO,
    UpdateGeneralAttendanceRequestDTO,
    StudentListByClassAndDateResponseDTO,
    PostClassAttendanceDTO,
    UpdateClassAttendanceRequestDTO,
    GeneralAttendanceResponseDTO
} from "../application/dtos";
import { CustomParseDatePipe } from "src/common/pipes/CustomParseDatePipe";

@Controller("frequency")
@ApiTags("frequency-resource")
@ApiBearerAuth("JWT-auth")
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
        example:{
            "classes": [
                {
                    "classId": null,
                    "className": "Geral",
                    "classState": "ATIVA",
                    "levelName": null,
                    "isGeral": true,
                    "activity": {
                        "activityId": null,
                        "activityName": "Atividade geral"
                    }
                },
                {
                    "classId": 1,
                    "className": "Tênis I",
                    "classState": "ATIVA",
                    "levelName": "Iniciante",
                    "isGeral": false,
                    "activity": {
                        "activityId": 1,
                        "activityName": "Esportes"
                    }
                }
        ]
    }
    })
    @ApiResponse({ status: 404, description: "User with the specified ID was not found." })
    @ApiResponse({ status: 500, description: "An unexpected internal server error occurred." })
    async getUserClasses(@Param("userId", ParseIntPipe) userId: number):Promise<UserClassesResponseDTO>{
        return await this.frequencyService.getUserClasses(userId);
    }
    @Get("general-attendance")
    @ApiOperation({
        summary: "Get general attendance list for a specific date",
        description: "Retrieves the consolidated attendance information for all active students on a given date, showing their attendance status and eligibility for general attendance tracking"
    })
    @ApiQuery({
        name: 'date',
        required: true,
        type: String,
        example: '2025-09-20',
        description: 'The date for which to retrieve attendance records (YYYY-MM-DD format)'
    })
    @ApiResponse({
        status: 200,
        description: "Successfully retrieved the general attendance list",
        type: GeneralAttendanceResponseDTO,
    })
    @ApiResponse({
        status: 400,
        description: "Invalid date format"
    })
    @ApiResponse({
        status: 500,
        description: "An unexpected server error occurred"
    })
    async getGeneralAttendance(@Query('date', CustomParseDatePipe) date: Date): Promise<GeneralAttendanceResponseDTO> {
    const studentList = await this.frequencyService.getGeneralAttendance(date);
    return studentList;
    }
    @Patch("general-attendance")
    @HttpCode(204)
    @ApiOperation({
    summary: "Update general attendance records",
    description: "Updates the general attendance status for multiple students. Present students will have records created or updated, while absent students will have records removed from the frequency table."
    })
    @ApiBody({
    type: UpdateGeneralAttendanceRequestDTO,
    description: "The list of attendance updates to process",
    examples: {
        standard: {
        value: {
            date: "2025-09-11",
            studentList: [
            {
                studentId: 1,
                status: "PRESENTE",
                generalAttendanceAllowed: true
            },
            {
                studentId: 2,
                status: "AUSENTE",
                generalAttendanceAllowed: true
            },
            {
                studentId: 3,
                status: "PRESENTE",
                generalAttendanceAllowed: false
            }
            ]
        },
        summary: "Mixed attendance update"
        }
    }
    })
    @ApiResponse({
    status: 204,
    description: "Successfully updated the general attendance records"
    })
    @ApiResponse({
    status: 400,
    description: "Invalid request format or missing required data"
    })
    @ApiResponse({
    status: 500,
    description: "Failed to update attendance records"
    })
    async updateGeneralAttendance(@Body() updateDto: UpdateGeneralAttendanceRequestDTO): Promise<void> {
    await this.frequencyService.updateGeneralAttendance(updateDto);
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
    async getClassAttendanceList(
        @Query('classId', ParseIntPipe) classId: number,
        @Query('date', CustomParseDatePipe) date: Date
    ): Promise<StudentListByClassAndDateResponseDTO> {
    return await this.frequencyService.getAttendanceListByClassAndDate(date, classId);
    }
    @Post("class-attendance")
    @ApiOperation({
    summary: "Create a new attendance list for a class on a specific date",
    description: "Creates attendance records for all enrolled students in the specified class, setting their default status to PRESENTE."
    })
    @ApiBody({
    type: PostClassAttendanceDTO,
    description: "Class ID and date for creating the attendance list",
    examples: {
        example1: {
        value: {
            classId: 2,
            date: "2025-09-15"
        },
        summary: "Standard attendance creation request"
        }
    }
    })
    @ApiResponse({
    status: 201,
    description: "Successfully created the attendance list",
    type: StudentListByClassAndDateResponseDTO
    })
    @ApiResponse({
    status: 409,
    description: "Attendance list already exists for this class and date"
    })
    @ApiResponse({
    status: 404,
    description: "The class has no enrolled students or the class was not found"
    })
    @ApiResponse({
    status: 500,
    description: "Failed to create the attendance list"
    })
    @HttpCode(201)
    async postClassAttendance(@Body() body: PostClassAttendanceDTO): Promise<StudentListByClassAndDateResponseDTO> {
    return await this.frequencyService.createAttendanceList(body.date, body.classId);
    };
    @Patch("class-attendance")
    @HttpCode(204)
    @ApiOperation({
    summary: "Update attendance records for a class",
    description: "Updates the attendance status and notes for multiple students in a specific class on a given date."
    })
    @ApiBody({
    type: UpdateClassAttendanceRequestDTO,
    description: "The class attendance records to update",
    examples: {
        standard: {
        value: {
            classId: 2,
            date: "2025-09-11",
            studentList: [
            {
                frequencyId: 19,
                studentId: 2,
                status: "PRESENTE",
                notes: null
            },
            {
                frequencyId: 20,
                studentId: 5,
                status: "AUSENTE",
                notes: "ATESTADO-MEDICO"
            }
            ]
        },
        summary: "Update attendance for multiple students"
        }
    }
    })
    @ApiResponse({
    status: 204,
    description: "Successfully updated the attendance records"
    })
    @ApiResponse({
    status: 400,
    description: "Invalid request format or missing required data"
    })
    @ApiResponse({
    status: 404,
    description: "Class attendance records not found for the specified date"
    })
    @ApiResponse({
    status: 500,
    description: "Failed to update attendance records"
    })
    async updateClassAttendance(
    @Body() updateDto: UpdateClassAttendanceRequestDTO
    ): Promise<void> {
    await this.frequencyService.updateAttendanceList(updateDto);
    }
}
