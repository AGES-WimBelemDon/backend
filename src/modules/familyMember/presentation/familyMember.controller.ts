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
    @ApiOperation({ summary: 'Create new family member' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Family member successfully created',
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
                "nis": "12345678900",
                "registrationNumber": "98765432100",
                "educationLevel": "SUPERIOR_COMPLETO",
                "dateOfBirth": "1980-10-25T00:00:00.000Z",
                "socialPrograms": "BOLSA_FAMILIA",
                "employmentStatus": "EMPREGADO",
                "studentIds": [1, 2],
            }
        }
    })
    @ApiResponse({ status: 400, description: "Invalid Data (Bad Request)" })
    @ApiResponse({ status: 409, description: "Email already exists!" })
    async createFamilyMember(@Body() createFamilyMemberDto: CreateFamilyMemberDTO) {
        const familyMember = await this.familyMemberService.create(createFamilyMemberDto);
        return FamilyMemberMapper.toResponse(familyMember);
    }

    @Get('student/:studentId')
    @ApiOperation({ summary: 'Search all family members from Student' })
    @ApiParam({ name: 'studentId', description: 'Student ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Family members retrieved successfully.'})
    async findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
        const familyMembers = await this.familyMemberService.findByStudentId(studentId);
        return familyMembers.map(member => FamilyMemberMapper.toResponse(member));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get Family Member by ID' })
    @ApiParam({ name: 'id', description: 'Family Member ID', type: 'number' })
    async getById(@Param('id', ParseIntPipe) id: number) {
        const familyMember = await this.familyMemberService.findById(id);
        return FamilyMemberMapper.toResponse(familyMember);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update Family Member Data' })
    @ApiParam({ name: 'id', description: 'Family Member ID', type: 'number' })
    @ApiResponse({ status: 200, description: 'Family member successfully updated',})
    @ApiResponse({ status: 400, description: "Invalid Data! (Bad Request)" })
    @ApiResponse({ status: 404, description: "Family Member not found!" })
    @ApiResponse({ status: 409, description: "Email already exists!" })
    async updateFamilyMember(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateFamilyMemberDto: UpdateFamilyMemberDTO,
    ) {
        const updatedFamilyMember = await this.familyMemberService.update(id, updateFamilyMemberDto);
        return FamilyMemberMapper.toResponse(updatedFamilyMember);
    }
}