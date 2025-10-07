import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IStudentRepository } from "../domain/student-repository.interface";
import { Student } from "../domain/student.entity";
import { StudentMapper } from "./student.mapper";
import { disconnect } from "process";
import { ListStudentsQueryDto } from "../application/list-students.query.dto";

@Injectable()
export class StudentRepository implements IStudentRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(student: Student): Promise<Student> {
        const familyMemberIds = student.getFamilyMembersId()?.map(idValue => ({id : idValue})) ?? []
        const prismaStudent = await this.prisma.student.create({
            data: {
                fullName: student.getFullName(),
                registrationNumber: student.getRegistrationNumber(),
                dateOfBirth: student.getDateOfBirth() || null,
                socialName: student.getSocialName() || null,
                enrollmentDate: student.getEnrollmentDate(),
                status: student.getStatus(),
                disenrollmentDate: student.getDisenrollmentDate() ?? null,
                race : student.getRace(),
                gender : student.getGender(),
                levelId : student.getLevelId(),
                schoolName : student.getSchoolName(),
                schoolShift : student.getSchoolShift(),
                schoolYear : student.getSchoolYear(),
                gradeGap : student.getGradeGap(),
                socialPrograms : student.getSocialPrograms(),
                employmentStatus : student.getEmploymentStatus(),
                addressId : student.getAddressId(),
                family : {
                    connect: familyMemberIds
                }
            },
            include: {
                family: true,
                frequencies: true,
                answers: true,
                docs: true,
                classes: true
            }
           
        });

        return StudentMapper.toDomain(prismaStudent);
    }

    async findByRegistrationNumber(registrationNumber: string): Promise<Student | null> {
        const prismaStudent = await this.prisma.student.findUnique({
            where: { registrationNumber },
            include: {
                family: true,
                frequencies: true,
                answers: true,
                docs: true,
                classes: true
            }
        });

        if (!prismaStudent) {
            return null;
        }

        return StudentMapper.toDomain(prismaStudent);
    }

    async findById(id: number): Promise<Student | null> {
        const prismaStudent = await this.prisma.student.findUnique({
            where: { id },
            include: {
                family: true,
                frequencies: true,
                answers: true,
                docs: true,
                classes: true
            }
        });

        if (!prismaStudent) {
            return null;
        }

        return StudentMapper.toDomain(prismaStudent);
    }

    async findManyById(ids: number[]): Promise<Student[]> {
        const prismaStudents = await this.prisma.student.findMany({
            where: {
                id: {
                    in: ids
                }
            },
            include: {
                family: true,
                frequencies: true,
                answers: true,
                docs: true,
                classes: true
            }
        });

        return prismaStudents.map(StudentMapper.toDomain);
    }

    async findAll(query: ListStudentsQueryDto): Promise<Student[]> {
        const where: any = {}
        if(query.levelId){
            where.levelId = query.levelId
        }
        if(query.status){
            where.status = query.status
        }
        const prismaStudents = await this.prisma.student.findMany({
            where,
            orderBy: { id: 'asc' },
            include: {
                family: true,
                frequencies: true,
                answers: true,
                docs: true,
                classes: true
            }
        });

        return prismaStudents.map(StudentMapper.toDomain);
    }

    async update(student: Student ): Promise<Student> {
        const id = student.getId();
        const prismaStudent = await this.prisma.student.update({
            where: { id },
            data: {
                fullName: student.getFullName(),
                socialName: student.getSocialName() || null,
                dateOfBirth: student.getDateOfBirth() || null,
                registrationNumber: student.getRegistrationNumber(),
                enrollmentDate: student.getEnrollmentDate(),
                disenrollmentDate: student.getDisenrollmentDate(),
                race: student.getRace(),
                schoolName: student.getSchoolName(),
                status: student.getStatus(),
                schoolShift: student.getSchoolShift(),
                schoolYear: student.getSchoolYear(),
                gender: student.getGender(),
                employmentStatus: student.getEmploymentStatus(),
                gradeGap: student.getGradeGap(),

                address: student.getAddressId() == null
                    ? { disconnect: true }
                    : { connect: { id: student.getAddressId() as number }},
                level: student.getLevelId() == null
                    ? {disconnect : true}
                    : {connect: {id: student.getLevelId() as number}},
                family: {
                    set: student.getFamilyMembersId()?.map(item=>({id : item})) ?? []
                }
            },
            include: {
                family: true,
                frequencies: true,
                answers: true,
                docs: true,
                classes: true
            }
        });

        return StudentMapper.toDomain(prismaStudent);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.student.update({
            where: { id },
            data: { status: 'INATIVO' },
        });
    }
}
