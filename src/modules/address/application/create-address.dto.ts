import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateAddressDTO {
    @ApiProperty({ example: "Avenida Ipiranga" })
    @IsString() 
    @IsNotEmpty() 
    street: string;

    @ApiProperty({ example: "Porto Alegre" })
    @IsString() 
    @IsNotEmpty() 
    city: string;

    @ApiProperty({ example: "RS" })
    @IsString() 
    @IsNotEmpty() 
    @MaxLength(2) 
    state: string;

    @ApiProperty({ example: "90020-000" })
    @IsString()
    @IsNotEmpty() 
    cep: string;

    @ApiProperty({ example: "Centro" })
    @IsString() 
    @IsNotEmpty() 
    neighborhood: string;

    @ApiProperty({ example: "200", required: false })
    @IsOptional() 
    @IsString() 
    number?: string;

    @ApiProperty({ example: "Apartamento 502", required: false })
    @IsOptional() 
    @IsString() 
    complement?: string;
}