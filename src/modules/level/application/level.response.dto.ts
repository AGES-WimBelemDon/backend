import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class LevelResponseDTO{
    @ApiProperty({
        example: 1,
        type: Number,
        description: "The id of the level"
    })
    public id: number
    @ApiProperty({
        example: "INFANTIL",
        type: String,
        description: "The name of the level"
    })
    public name: string
    @ApiProperty({
        example: "Educação Infantil",
        type: String,
        description: "The description of the level"
    })
    public description: string | null
}