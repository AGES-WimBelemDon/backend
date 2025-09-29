import { Module } from "@nestjs/common";
import { StudentController } from "./presentation/student.controller";
import { StudentService } from "./application/student.service";
import { StudentRepository } from "./infrastructure/student.repository";
import { STUDENT_REPOSITORY_TOKEN } from "./domain/student-repository.interface";
import { PrismaModule } from "src/prisma/prisma.module";
import { FirebaseModule } from "../firebase/firebase.module";

@Module({
    imports: [PrismaModule, FirebaseModule],
    controllers: [StudentController],
    providers: [
        StudentService,
        {
            provide: STUDENT_REPOSITORY_TOKEN,
            useClass: StudentRepository,
        },
    ],
    exports: [StudentService, STUDENT_REPOSITORY_TOKEN],
})
export class StudentModule {}
