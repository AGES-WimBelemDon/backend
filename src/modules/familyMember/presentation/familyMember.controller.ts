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
} from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiParam,
} from '@nestjs/swagger';
import { FamilyMemberService } from '../application/familyMember.service';
import { CreateFamilyMemberDTO } from '../application/createFamilyMember.dto';
import { FamilyMemberMapper } from '../infrastructure/familyMember.mapper';
import { UpdateFamilyMemberDTO } from '../application/updateFamilyMember.dto';

@ApiTags('family-member')
@Controller('family-member')
export class FamilyMemberController {
    constructor(private readonly familyMemberService: FamilyMemberService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Cadastra um novo membro da família' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'O membro da família foi criado com sucesso.',
        schema: {
            example: {
                "id": 1,
                "fullName": "Joana Oliveira",
                "phoneNumber": "51999999999",
                "relationship": "mãe",
                "email": "joana.o@gmail.com",
                "socialName": "Joana",
                "race": "BRANCA",
                "gender": "FEMININO",
                "educationLevel": "SUPERIOR_COMPLETO",
                "dateOfBirth": "1980-10-25T00:00:00.000Z",
                "socialPrograms": "BOLSA_FAMILIA",
                "employmentStatus": "EMPREGADO",
                "studentIds": [1, 2],
            }
        }
    })
    @ApiResponse({ status: 400, description: "Dados inválidos (Bad Request)" })
    @ApiResponse({ status: 404, description: "Dependência não encontrada (ex: Student ou Address)" })
    @ApiResponse({ status: 409, description: "Conflito de dados (ex: e-mail já existe)" })
    async createFamilyMember(@Body() createFamilyMemberDto: CreateFamilyMemberDTO) {
        const familyMember = await this.familyMemberService.create(createFamilyMemberDto);
        return FamilyMemberMapper.toResponse(familyMember);
    }

    @Get('student/:studentId')
    @ApiOperation({ summary: 'Busca todos os membros da família de um estudante específico' })
    @ApiParam({ name: 'studentId', description: 'ID do estudante', type: 'number' })
    @ApiResponse({ status: 200, description: 'Lista de membros da família retornada com sucesso.'})
    async findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
        const familyMembers = await this.familyMemberService.findByStudentId(studentId);
        return familyMembers.map(member => FamilyMemberMapper.toResponse(member));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza os dados de um membro da família' })
    @ApiParam({ name: 'id', description: 'ID do membro da família', type: 'number' })
    @ApiResponse({ status: 200, description: 'Membro da família atualizado com sucesso.'})
    @ApiResponse({ status: 400, description: "Dados inválidos (Bad Request)" })
    @ApiResponse({ status: 404, description: "Membro da família ou dependência não encontrada (ex: Student ou Address)" })
    @ApiResponse({ status: 409, description: "Conflito de dados (ex: e-mail já existe)" })
    async updateFamilyMember(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateFamilyMemberDto: UpdateFamilyMemberDTO,
    ) {
        const updatedFamilyMember = await this.familyMemberService.update(id, updateFamilyMemberDto);
        return FamilyMemberMapper.toResponse(updatedFamilyMember);
    }
}