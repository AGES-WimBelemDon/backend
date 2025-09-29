import { PartialType } from '@nestjs/swagger';
import { CreateFamilyMemberDTO } from './createFamilyMember.dto';

export class UpdateFamilyMemberDTO extends PartialType(CreateFamilyMemberDTO) {}