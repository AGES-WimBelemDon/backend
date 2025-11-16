import { Controller, Get, HttpStatus } from "@nestjs/common";
import { LevelService } from "../application/level.service";
import { LevelMapper } from "../infrastructure/level.mapper";
import { LevelResponseDTO } from "../application/level.response.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StaffAndInterns } from "src/common/decorators/common.roles.decorator";

@ApiTags("level")
@Controller("level")
@ApiBearerAuth("JWT-auth")
@StaffAndInterns()
export class LevelController{
    constructor(
        private readonly levelService: LevelService
    ){}
    @Get()
    @ApiOperation({ 
            summary: "List education levels",
            description: "Retrieves all available education levels in the system"
        })
    @ApiResponse({ 
            status: HttpStatus.OK, 
            description: "List all education levels",
            type: [LevelResponseDTO],
            example: [
                        {
                            "id": 7,
                            "name": "INFANTIL",
                            "description": "Educação Infantil"
                        },
                        {
                            "id": 8,
                            "name": "FUND1",
                            "description": "Fundamental 1"
                        },
                        {
                            "id": 9,
                            "name": "MEDIO",
                            "description": "Ensino Médio"
                        }
                    ]
        })
    public async findAll(): Promise<LevelResponseDTO[]>{
        const levelList = await this.levelService.findAll();
        return levelList.map(LevelMapper.toResponse);
    }
}
