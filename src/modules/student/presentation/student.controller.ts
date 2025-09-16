import { 
    Body, 
    Controller, 
    Get, 
    Post, 
    HttpCode, 
    HttpStatus,
    Param,
    ParseIntPipe
} from "@nestjs/common";
import { 
    ApiOperation, 
    ApiResponse, 
    ApiTags,
    ApiParam
} from "@nestjs/swagger";
import { StudentService } from "../application/student.service";
import { CreateStudentDTO } from "../application/create-student.dto";
import { StudentMapper } from "../infrastructure/student.mapper";

@ApiTags("students")
@Controller("students")
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: "Register new student",
        description: "Registers a new student in the system with unique CPF validation"
    })
    @ApiResponse({ 
        status: 201, 
        description: "Student successfully created",
        schema: {
            example: {
                id: 1,
                fullName: "John Silva Santos",
                registrationNumber: "12345678901",
                dateOfBirth: "2010-05-15T00:00:00.000Z",
                socialName: "John",
                enrollmentDate: "2025-09-07T15:30:00.000Z",
                status: "ACTIVE"
            }
        }
    })
    @ApiResponse({ 
        status: 400, 
        description: "Invalid data",
        schema: {
            example: {
                statusCode: 400,
                message: [
                    "Full name is required",
                    "CPF must contain exactly 11 numeric digits",
                    "Date of birth must be in YYYY-MM-DD format"
                ],
                error: "Bad Request"
            }
        }
    })
    @ApiResponse({ 
        status: 409, 
        description: "CPF already registered",
        schema: {
            example: {
                statusCode: 409,
                message: "CPF is already in use",
                error: "Conflict"
            }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: "Internal server error",
        schema: {
            example: {
                statusCode: 500,
                message: "Internal server error",
                error: "Internal Server Error"
            }
        }
    })
    async createStudent(@Body() createStudentDto: CreateStudentDTO) {
        const student = await this.studentService.createStudent(createStudentDto);
        return StudentMapper.toResponse(student);
    }

    @Get()
    @ApiOperation({ 
        summary: "List all students",
        description: "Returns a list of all active students in the system"
    })
    @ApiResponse({ 
        status: 200, 
        description: "Student list successfully retrieved"
    })
    async findAllStudents() {
        const students = await this.studentService.findAll();
        return students.map(StudentMapper.toResponse);
    }

    @Get(':id')
    @ApiOperation({ 
        summary: "Find student by ID",
        description: "Returns the data of a specific student"
    })
    @ApiParam({ name: 'id', description: 'Student ID', type: 'number' })
    @ApiResponse({ 
        status: 200, 
        description: "Student successfully found"
    })
    @ApiResponse({ 
        status: 404, 
        description: "Student not found"
    })
    async findStudentById(@Param('id', ParseIntPipe) id: number) {
        const student = await this.studentService.findById(id);
        if (!student) {
            return { message: "Student not found" };
        }
        return StudentMapper.toResponse(student);
    }

    @Get('cpf/:registrationNumber')
    @ApiOperation({ 
        summary: "Find student by CPF",
        description: "Returns the data of a student by CPF"
    })
    @ApiParam({ name: 'registrationNumber', description: 'Student CPF (11 digits)', type: 'string' })
    @ApiResponse({ 
        status: 200, 
        description: "Student successfully found"
    })
    @ApiResponse({ 
        status: 404, 
        description: "Student not found"
    })
    async findStudentByRegistrationNumber(@Param('registrationNumber') registrationNumber: string) {
        const student = await this.studentService.findByRegistrationNumber(registrationNumber);
        if (!student) {
            return { message: "Student not found" };
        }
        return StudentMapper.toResponse(student);
    }
}
