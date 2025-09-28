
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

    @Get()
    @ApiOperation({ 
        summary: "List all classes",
        description: "Returns a list of all classes in the system"
    })
    @ApiResponse({ 
        status: 200, 
        description: "Class list successfully retrieved"
    })
    async findAllClasses() {
        const classes = await this.classService.findAll();
        return classes.map(ClassMapper.toResponse);
    }

    @Get(':id')
    @ApiOperation({ 
        summary: "Find class by ID",
        description: "Returns the data of a specific class"
    })
    @ApiParam({ name: 'id', description: 'Class ID', type: 'number' })
    @ApiResponse({ 
        status: 200, 
        description: "Class successfully found"
    })
    @ApiResponse({ 
        status: 404, 
        description: "Class not found"
    })
    async findClassById(@Param('id', ParseIntPipe) id: number) {
        const classEntity = await this.classService.findById(id);
        if (!classEntity) {
            return { message: "Class not found" };
        }
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


    @ApiOperation({ 
        summary: "Update a existing class",
        description: "Update a class from the database"
    })
    @ApiResponse({ 
        status: 204, 
        description: "Class was successfully updated"
    })
    @ApiResponse({ 
        status: 404, 
        description: "Class not found"
    })
    @Patch(':id')
    async updateClass(@Param('id', ParseIntPipe) id: number, body: Partial<Class>){
        return await this.classService.updateClass(id, body)
    }
}
