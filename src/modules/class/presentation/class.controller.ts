
import { 
    Body, 
    Controller, 
    Get, 
    Post, 
    HttpCode, 
    HttpStatus,
    Param,
    ParseIntPipe,
    Delete,
    Patch
} from "@nestjs/common";
import { 
    ApiOperation, 
    ApiResponse, 
    ApiTags,
    ApiParam
} from "@nestjs/swagger";
import { ClassService } from "../application/class.service";
import { CreateClassDTO } from "../application/create-class.dto";
import { ClassMapper } from "../infrastructure/class.mapper";
import { Class } from "@prisma/client";

@ApiTags("classes")
@Controller("classes")
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: "Register new class",
        description: "Registers a new class in the system"
    })
    @ApiResponse({ 
        status: 201, 
        description: "Class successfully created",
    })
    @ApiResponse({ 
        status: 400, 
        description: "Invalid data",
    })
    @ApiResponse({ 
        status: 500, 
        description: "Internal server error",
    })
    async createClass(@Body() createClassDto: CreateClassDTO) {
        const classEntity = await this.classService.createClass(createClassDto);
        return ClassMapper.toResponse(classEntity);
    }

    @Delete(':id')
    @ApiOperation({ 
        summary: "Delete a existing class",
        description: "Remove a class from the database"
    })
    @ApiResponse({ 
        status: 200, 
        description: "Class was successfully removed"
    })
    @ApiResponse({ 
        status: 404, 
        description: "Class not found"
    })
    async deleteClass(@Param('id', ParseIntPipe) id: number) {
        return await this.classService.deleteClass(id)
    }

}
