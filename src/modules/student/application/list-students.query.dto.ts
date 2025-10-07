import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsOptional } from "class-validator"
import { StudentStatus } from "src/common/enums/domain.enums"

export class ListStudentsQueryDto {
    @IsNumber()
    @Type(()=>Number)
    @IsOptional()
    @ApiPropertyOptional({ description: "Filter by levelId" })
    levelId?: number
    
    @IsEnum(StudentStatus)
    @IsOptional()
    @ApiPropertyOptional({
        description: "Filter by the student status",
        enum: StudentStatus})
    status?: StudentStatus
}