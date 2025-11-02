import { ApiProperty } from "@nestjs/swagger";

export class AddressResponseDTO {
  @ApiProperty({
    example: 1,
    description: "Address ID",
  })
  id: number;

  @ApiProperty({
    example: "12345-678",
    description: "Brazilian postal code (CEP)",
  })
  cep: string;

  @ApiProperty({
    example: "Rua Example",
    description: "Street name",
  })
  street: string;

  @ApiProperty({
    example: "123",
    description: "Street number",
    nullable: true,
    required: false,
  })
  number: string | null;

  @ApiProperty({
    example: "Apt 4B",
    description: "Address complement (apartment, suite, etc.)",
    nullable: true,
    required: false,
  })
  complement: string | null;

  @ApiProperty({
    example: "Centro",
    description: "Neighborhood",
  })
  neighborhood: string;

  @ApiProperty({
    example: "São Paulo",
    description: "City name",
  })
  city: string;

  @ApiProperty({
    example: "SP",
    description: "State abbreviation (2 letters)",
  })
  state: string;
}