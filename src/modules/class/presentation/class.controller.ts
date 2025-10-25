import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ClassService } from "../application/class.service";
import { CreateClassDTO } from "../application/create-class.request.dto";


@ApiTags("class")
@Controller("class")
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Register new class",
    description: "Registers a new class in the system",
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
    status: 404,
    description: "Not found",
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
  })
  async createClass(@Body() createClassDto: CreateClassDTO) {
    const classEntity = await this.classService.createClass(createClassDto);
    return;
  }
}