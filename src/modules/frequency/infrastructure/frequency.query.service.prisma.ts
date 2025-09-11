import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IFrequencyQueries } from "../application/frequency.service.query.interfaces";
import { UserClassesDTO, StudentGeneralAttendanceDTO } from "../application/frequency.dtos";
import { FrequencyDTOMapper,PrismaStudentGeneralFrequency } from "./frequency.dto.mapper";

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
  async getGeneralAttendance(date: Date): Promise<StudentGeneralAttendanceDTO[]>{
    const result = await this.prisma.$queryRaw<PrismaStudentGeneralFrequency[]>`
      WITH 
      freq_query AS (
          SELECT
              id_student AS studentId,
              NULL       AS frequencyId,
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
              id         AS frequencyId,
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
            fq.frequencyId,
            fq.generalAttendanceAllowed,
            fq.status
        FROM active_students AS acs
        LEFT JOIN freq_query AS fq
        ON acs.studentId = fq.studentId
      )
      SELECT
        left_j.studentId,
        left_j.frequencyId,
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
}