import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ExampleEntityService } from "../application/exampleEntity.service";
import { ExampleEntity } from "../domain/exampleEntity.entity";
import { CreateExampleEntityDTO } from "../application/create-exampleEntity.dto";
import { FirebaseAuthGuard } from "src/common/guards/firebase-auth.guard";
@ApiTags("example-entity")
@Controller("example-entity")
@ApiBearerAuth("JWT-auth")
export class ExampleEntityontroller{
    constructor(private exampleEntityService: ExampleEntityService){}
    @Post()
    @ApiOperation({ summary: "Create a new example entity" })
    @ApiResponse({ status: 201, description: "The example entity has been successfully created." })
    @ApiResponse({ status: 403, description: "Forbidden." })
    async createExampleEntity(@Body() createExampleEntitytDto: CreateExampleEntityDTO):Promise<ExampleEntity>{
        return await this.exampleEntityService.createExampleEntity(createExampleEntitytDto)
    }
    @ApiOperation({ summary: "Hello world" })
    @Get()
    async get(){
        return "hello world";
    }
    @Get("protected")
    @UseGuards(FirebaseAuthGuard)
    @ApiOperation({summary:"Protected route"})
    get_protect(@Request() req: any){
        const user = req.user;
        return user;
    }
}