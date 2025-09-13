import {
    Body,
    Controller,
    Get,
    Post,
    HttpCode,
    HttpStatus,
    Param,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiParam,
} from '@nestjs/swagger';
import { FamilyMemberService } from '../application/familyMember.service';
import { CreateFamilyMemberDTO } from '../application/createFamilyMember.dto';
import { familyMemberMapper } from '../infrastructure/familyMember.mapper';

@ApiTags('Family Member')
@Controller('family-member')
export class FamilyMemberController {
    constructor(private readonly familyMemberService: FamilyMemberService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new family member' })

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The family member has been successfully created.',
        schema: {
            example: {
                "fullName": "Joana Oliveira",
                "phoneNumber": "51999999999",
                "relationship": "mãe",
                "email": null,
                "socialName": null,
                "race": null,
                "gender": null,
                "educationLevel": null,
                "dateOfBirth": null,
                "socialPrograms": null,
                "employmentStatus": null,
                "studentId": 1,
                "addressId": 100
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
                    "Número de telefone é obrigatório",
                    "Data de nascimento deve estar no formato YYYY-MM-DD"
                ],
                error: "Bad Request"
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

    async createFamilyMember(@Body() createFamilyMemberDto: CreateFamilyMemberDTO) {
        const familyMember = await this.familyMemberService.create(createFamilyMemberDto);
        return familyMemberMapper.toPersistence(familyMember);
    }
}
