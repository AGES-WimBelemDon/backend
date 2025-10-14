import { ApiProperty } from '@nestjs/swagger';
import { FormType } from 'src/common/enums/domain.enums';

export class FormResponseDTO {
  @ApiProperty({
    description: 'Unique identifier of the form',
    example: 1,
    type: Number
  })
  id: number;

  @ApiProperty({
    description: 'Title of the form',
    example: 'Initial Assessment',
    type: String
  })
  title: string;

  @ApiProperty({
    description: 'Type of assessment form',
    enum: FormType,
    enumName: 'FormType',
    example: 'INITIAL',
  })
  type: FormType;
}