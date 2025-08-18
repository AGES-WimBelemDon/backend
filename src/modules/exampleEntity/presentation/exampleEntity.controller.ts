import { Body, Controller, Get, Post } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ExampleEntityService } from "../application/exampleEntity.service";
import { ExampleEntity } from "../domain/exampleEntity.entity";
import { CreateExampleEntityDTO } from "../application/create-exampleEntity.dto";
@ApiTags("exampleEntity")
@Controller("exampleEntity")
export class ExampleEntityontroller{
    constructor(private exampleEntityService: ExampleEntityService){}
    @Post()
    @ApiOperation({ summary: "Create a new student" })
    @ApiResponse({ status: 201, description: "The student has been successfully created." })
    @ApiResponse({ status: 403, description: "Forbidden." })
    async createStudent(@Body() createExampleEntitytDto: CreateExampleEntityDTO):Promise<ExampleEntity>{
        return await this.exampleEntityService.createExampleentity(createExampleEntitytDto)
    }
    @ApiOperation({ summary: "Hello world" })
    @Get()
    async get(){
        return "hello world";
    }
}