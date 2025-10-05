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
import { CreateStudentRequestDTO } from "../application/create-student.request.dto";
import { StudentMapper } from "../infrastructure/student.mapper";
import { UpdateStudentDTO } from "../application/update-student.dto";
import { AddressMapper } from "src/modules/address/infrastructure/address.mapper";
import { CreateAddressDTO } from "src/modules/address/application/create-address.dto";
import { StudentResponseDTO } from "../application/student.response.dto";

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
    type: StudentResponseDTO,
    schema: {
      example: {
          id: 1,
          fullName: "John Silva Santos",
          registrationNumber: "12345678901",
          enrollmentDate: "2023-01-15T00:00:00.000Z",
          disenrollmentDate: null,
          status: "ATIVO",
          dateOfBirth: "2010-05-15T00:00:00.000Z",
          socialName: "John",
          race: "PARDA",
          gender: "MASCULINO",
          levelId: 2,
          schoolName: "Escola Municipal João da Silva",
          schoolShift: "Matutino",
          schoolYear: "ENSINO_MEDIO_1",
          gradeGap: true,
          socialPrograms: "BOLSA_FAMILIA",
          employmentStatus: "DESEMPREGADO",
          addressId: 100,
          familyMembersId: [1, 2],
          frequenciesId: [1, 2, 3],
          answersId: [1, 2],
          classesId: [1, 2]
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
        status: 404, 
        description: "Invalid levelId",
        schema: {
            example: {
                statusCode: 404,
                message: "The levelId wasn't found in the database",
                error: "Not Found"
            }
        }
    })
    @ApiResponse({ 
        status: 404, 
        description: "Invalid addressId",
        schema: {
            example: {
                statusCode: 404,
                message: "Address with ID 100 not found",
                error: "Not Found"
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
    async createStudent(@Body() createStudentDto: CreateStudentRequestDTO): Promise<StudentResponseDTO> {
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
    description: "Student list successfully retrieved",
    schema: {
        example: [
            {
            id: 1,
            fullName: "John Silva Santos",
            registrationNumber: "12345678901",
            enrollmentDate: "2023-01-15T00:00:00.000Z",
            disenrollmentDate: null,
            status: "ATIVO",
            dateOfBirth: "2010-05-15T00:00:00.000Z",
            socialName: "John",
            race: "PARDA",
            gender: "MASCULINO",
            levelId: 2,
            schoolName: "Escola Municipal João da Silva",
            schoolShift: "Matutino",
            schoolYear: "ENSINO_MEDIO_1",
            gradeGap: true,
            socialPrograms: "BOLSA_FAMILIA",
            employmentStatus: "DESEMPREGADO",
            addressId: 100,
            familyMembersId: [101, 102],
            frequenciesId: [201, 202],
            answersId: [301],
            classesId: [401]
            },
            {
            id: 2,
            fullName: "Maria Oliveira",
            registrationNumber: "98765432109",
            enrollmentDate: "2023-02-20T00:00:00.000Z",
            disenrollmentDate: null,
            status: "ATIVO",
            dateOfBirth: "2009-11-10T00:00:00.000Z",
            socialName: null,
            race: "BRANCA",
            gender: "FEMININO",
            levelId: 3,
            schoolName: "Colégio Estadual Santos Dumont",
            schoolShift: "Vespertino",
            schoolYear: "FUNDAMENTAL_2",
            gradeGap: false,
            socialPrograms: null,
            employmentStatus: null,
            addressId: 105,
            familyMembersId: [103],
            frequenciesId: [203, 204, 205],
            answersId: [302, 303],
            classesId: [402, 403]
            }
        ]
        }
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
    description: "Student successfully found",
    schema: {
        example: {
            id: 1,
            fullName: "John Silva Santos",
            registrationNumber: "12345678901",
            enrollmentDate: "2023-01-15T00:00:00.000Z",
            disenrollmentDate: null,
            status: "ATIVO",
            dateOfBirth: "2010-05-15T00:00:00.000Z",
            socialName: "John",
            race: "PARDA",
            gender: "MASCULINO",
            levelId: 2,
            schoolName: "Escola Municipal João da Silva",
            schoolShift: "Matutino",
            schoolYear: "ENSINO_MEDIO_1",
            gradeGap: true,
            socialPrograms: "BOLSA_FAMILIA",
            employmentStatus: "DESEMPREGADO",
            addressId: 100,
            familyMembersId: [101, 102],
            frequenciesId: [201, 202],
            answersId: [301],
            classesId: [401]
        }
        }
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
    description: "Student successfully found",
    schema: {
            example: {
                id: 1,
                fullName: "John Silva Santos",
                registrationNumber: "12345678901",
                enrollmentDate: "2023-01-15T00:00:00.000Z",
                disenrollmentDate: null,
                status: "ATIVO",
                dateOfBirth: "2010-05-15T00:00:00.000Z",
                socialName: "John",
                race: "PARDA",
                gender: "MASCULINO",
                levelId: 2,
                schoolName: "Escola Municipal João da Silva",
                schoolShift: "Matutino",
                schoolYear: "ENSINO_MEDIO_1",
                gradeGap: true,
                socialPrograms: "BOLSA_FAMILIA",
                employmentStatus: "DESEMPREGADO",
                addressId: 100,
                familyMembersId: [101, 102],
                frequenciesId: [201, 202],
                answersId: [301],
                classesId: [401]
            }
        }
    })
    @ApiResponse({ 
        status: 404, 
        description: "Student not found",
        schema: {
            example: {
                statusCode: 404,
                message: "Student not found",
                error: "Not Found"
            }
        }
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
