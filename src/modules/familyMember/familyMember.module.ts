import { forwardRef, Module } from '@nestjs/common';
import { FamilyMemberService } from './application/familyMember.service';
import { FamilyMemberController } from './presentation/familyMember.controller';
import { PrismaFamilyMemberRepository } from './infrastructure/familyMember.repository';
import { FAMILY_MEMBER_REPOSITORY_TOKEN } from './domain/familyMember.repository.interface';
import { StudentModule } from '../student/student.module';

@Module({
    imports: [StudentModule],
    controllers: [FamilyMemberController],
    providers: [FamilyMemberService,
        {
            provide: FAMILY_MEMBER_REPOSITORY_TOKEN,
            useClass: PrismaFamilyMemberRepository,
        }],
    exports: [FamilyMemberService, FAMILY_MEMBER_REPOSITORY_TOKEN],
})
export class FamilyMemberModule { }