import { 
    Body, 
    Controller, 
    Get, 
    Post, 
    HttpCode, 
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Delete
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
import { UpdateStudentDTO } from "../application/update-student.dto";
import { AddressMapper } from "src/modules/address/infrastructure/address.mapper";
import { CreateAddressDTO } from "src/modules/address/application/create-address.dto";

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

    @Patch(':id')
    @ApiOperation({ summary: 'Update Student Data' })
    @ApiParam({ name: 'id', description: 'Student ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Student successfully updated',})
    @ApiResponse({ status: 400, description: "Invalid Data! (Bad Request)" })
    @ApiResponse({ status: 404, description: "Student not found!" })
    @ApiResponse({ status: 409, description: "Email already exists!" })
    async updateFamilyMember(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStudentDto: UpdateStudentDTO,
    ) {
        const updatedStudent = await this.studentService.update(id, updateStudentDto);
        return StudentMapper.toResponse(updatedStudent);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Student by ID' })
    @ApiParam({ name: 'id', description: 'Student ID', type: 'number' })
    @ApiResponse({ status: 204, description: 'Student successfully deleted.'})
    @ApiResponse({ status: 404, description: "Student not found!" })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        await this.studentService.delete(id);
    }

    @Get(':id/address')
    @ApiOperation({ summary: "Search for a student address" })
    @ApiResponse({ status: 200, description: 'Address retrieved successfully.'})
    @ApiResponse({ status: 404, description: "Address not found!" })
    async getAddress(@Param('id', ParseIntPipe) id: number) {
        const address = await this.studentService.getStudentAddress(id);
        return AddressMapper.toResponse(address);
    }

    @Post(':id/address')
    @ApiOperation({ summary: "Add a new address to a Student" })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Address successfully created",
        schema: {
            example: {
                    "street": "Avenida Ipiranga",
                    "city": "Porto Alegre",
                    "state": "RS",
                    "cep": "92010-001",
                    "neighborhood": "Centro"
            }
        }
    })
    async addAddress(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateAddressDTO,
    ) {
        const newAddress = await this.studentService.addAddressToStudent(id, dto);
        return AddressMapper.toResponse(newAddress);
    }

    @Delete(':id/address')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete an address from a student" })
    @ApiResponse({ status: 204, description: 'Address successfully deleted.'})
    @ApiResponse({ status: 404, description: "Address not found!" })
    async removeAddress(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.studentService.removeAddressFromStudent(id);
    }
}
