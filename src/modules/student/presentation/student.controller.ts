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

@ApiTags("alunos")
@Controller("alunos")
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: "Cadastrar novo educando",
        description: "Cadastra um novo aluno no sistema com validação de CPF único"
    })
    @ApiResponse({ 
        status: 201, 
        description: "Aluno criado com sucesso",
        schema: {
            example: {
                id: 1,
                fullName: "João Silva Santos",
                registrationNumber: "12345678901",
                dateOfBirth: "2010-05-15T00:00:00.000Z",
                socialName: "João",
                enrollmentDate: "2025-09-07T15:30:00.000Z",
                status: "ATIVO"
            }
        }
    })
    @ApiResponse({ 
        status: 400, 
        description: "Dados inválidos",
        schema: {
            example: {
                statusCode: 400,
                message: [
                    "Nome completo é obrigatório",
                    "CPF deve conter exatamente 11 dígitos numéricos",
                    "Data de nascimento deve estar no formato YYYY-MM-DD"
                ],
                error: "Bad Request"
            }
        }
    })
    @ApiResponse({ 
        status: 409, 
        description: "CPF já cadastrado",
        schema: {
            example: {
                statusCode: 409,
                message: "CPF já está em uso",
                error: "Conflict"
            }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: "Erro interno do servidor",
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
        summary: "Listar todos os alunos",
        description: "Retorna lista de todos os alunos ativos do sistema"
    })
    @ApiResponse({ 
        status: 200, 
        description: "Lista de alunos recuperada com sucesso"
    })
    async findAllStudents() {
        const students = await this.studentService.findAll();
        return students.map(StudentMapper.toResponse);
    }

    @Get(':id')
    @ApiOperation({ 
        summary: "Buscar aluno por ID",
        description: "Retorna os dados de um aluno específico"
    })
    @ApiParam({ name: 'id', description: 'ID do aluno', type: 'number' })
    @ApiResponse({ 
        status: 200, 
        description: "Aluno encontrado com sucesso"
    })
    @ApiResponse({ 
        status: 404, 
        description: "Aluno não encontrado"
    })
    async findStudentById(@Param('id', ParseIntPipe) id: number) {
        const student = await this.studentService.findById(id);
        if (!student) {
            return { message: "Aluno não encontrado" };
        }
        return StudentMapper.toResponse(student);
    }

    @Get('cpf/:registrationNumber')
    @ApiOperation({ 
        summary: "Buscar aluno por CPF",
        description: "Retorna os dados de um aluno através do CPF"
    })
    @ApiParam({ name: 'registrationNumber', description: 'CPF do aluno (11 dígitos)', type: 'string' })
    @ApiResponse({ 
        status: 200, 
        description: "Aluno encontrado com sucesso"
    })
    @ApiResponse({ 
        status: 404, 
        description: "Aluno não encontrado"
    })
    async findStudentByRegistrationNumber(@Param('registrationNumber') registrationNumber: string) {
        const student = await this.studentService.findByRegistrationNumber(registrationNumber);
        if (!student) {
            return { message: "Aluno não encontrado" };
        }
        return StudentMapper.toResponse(student);
    }
}
