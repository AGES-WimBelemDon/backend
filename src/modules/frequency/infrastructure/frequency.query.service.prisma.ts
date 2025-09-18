import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IFrequencyQueries } from "../application/frequency.service.query.interfaces";
import { UserClassesDTO, StudentGeneralAttendanceResponseDTO, EnrolledStudentDTO } from "../application/dtos";
import { FrequencyDTOMapper,PrismaStudentGeneralFrequency, PrismaStudentClassAttendance } from "./frequency.dto.mapper";

@Injectable()
export class PrismaFrequencyQueryService implements IFrequencyQueries {
    constructor(private readonly prisma: PrismaService) {}
    async getMyClasses(userId: number): Promise<UserClassesDTO[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        classes: {
          select: {
            id: true,
            name: true,
            state: true,
            level: {
              select: {
                name: true,
              },
            },
            activity: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.classes) {
      return [];
    }
    return user.classes.map(cls => FrequencyDTOMapper.toUserClassesDTO(cls));
  }
  async getGeneralAttendance(date: Date): Promise<StudentGeneralAttendanceResponseDTO[]>{
    const result = await this.prisma.$queryRaw<PrismaStudentGeneralFrequency[]>`
      WITH 
      freq_query AS (
          SELECT
              id_student AS studentId,
              'false' AS generalAttendanceAllowed,
              'PRESENTE' AS status
          FROM frequency
          WHERE
              date = ${date}
              AND status = 'PRESENTE'
              AND id_class IS NOT NULL
          GROUP BY id_student, date

          UNION
          
          SELECT
              id_student AS studentId,
              'true'    AS generalAttendanceAllowed,
              'PRESENTE' AS status
          FROM frequency
          WHERE
              date = ${date}
              AND status = 'PRESENTE'
              AND id_class IS NULL
          GROUP BY id_student, date, id
      ),
      active_students AS (
          SELECT
              id        AS studentId,
              full_name AS fullName
          FROM
              student
          WHERE
              status = 'ATIVO'
      ),
      left_j AS (
        SELECT
            acs.studentId,
            acs.fullName,
            fq.generalAttendanceAllowed,
            fq.status
        FROM active_students AS acs
        LEFT JOIN freq_query AS fq
        ON acs.studentId = fq.studentId
      )
      SELECT
        left_j.studentId,
        left_j.fullName,
        ${date} AS date,
        CASE
            WHEN left_j.generalAttendanceAllowed IS NULL THEN 'true'
            ELSE left_j.generalAttendanceAllowed
        END AS generalAttendanceAllowed,
        CASE
              WHEN left_j.status IS NULL THEN 'AUSENTE'
              ELSE left_j.status
        END AS status
      FROM left_j       
    `;
    if(!result){
      return []
    };
    const attendanceArray = result.map(arg=>FrequencyDTOMapper.toStudentGeneralAttendanceDTO(arg));
    return attendanceArray;
  }
  async getStudentByClassAndDateAttendanceList(classId: number, date: Date) {
    const results = await this.prisma.$queryRaw<PrismaStudentClassAttendance[]>`
        WITH
        total_classes AS (
          SELECT COUNT(DISTINCT date) AS count
          FROM frequency
          WHERE id_class = ${classId}
        ),
        student_attendance AS (
          SELECT
            id_student,
            COUNT(*) AS present_count
          FROM frequency
          WHERE id_class = ${classId}
          AND status = 'PRESENTE'
          GROUP BY id_student
        ),
        daily_attendance AS (
          SELECT
            id,
            id_student,
            status,
            notes
          FROM frequency
          WHERE id_class = ${classId}
          AND date = ${date}
        )
        SELECT
          d.id AS "frequencyId",
          s.id AS "stutentId",
          s.full_name AS "fullName",
          COALESCE(a.present_count, 0)/CAST((SELECT count FROM total_classes) AS DECIMAL(4,2)) AS attendance,
          d.status,
          d.notes
        FROM daily_attendance d
        JOIN student s ON s.id = d.id_student
        LEFT JOIN student_attendance a ON a.id_student = d.id_student
      `;
    return results.map(arg=>FrequencyDTOMapper.toStudentClassAttendanceItemDTO(arg));
  };
  async getStudentsByClassId(classId: number): Promise<EnrolledStudentDTO[]> {
    const enrolledStudents = await this.prisma.enrollment.findMany({
      where: {
        classId: classId
      },
      select: {
        student: {
          select: {
            id: true
          }
        }
      }
    });
    return enrolledStudents.map(enrollment => ({id: enrollment.student.id}));
  }
}