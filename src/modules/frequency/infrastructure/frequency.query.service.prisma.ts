import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IFrequencyQueries } from "../application/frequency.service.query.interfaces";
import { UserClassesDTO, StudentGeneralFrequencyDTO } from "../application/frequency.dtos";
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
  async getGeneralFrequency(date: Date): Promise<StudentGeneralFrequencyDTO[]>{
    const result = await this.prisma.$queryRaw<PrismaStudentGeneralFrequency[]>`
      WITH 
      freq_query AS (
          SELECT
              id_student AS id,
              date,
              'true' AS register_by_another_class,
              'PRESENTE' AS status
          FROM frequency
          WHERE
              date = ${date}
              AND status = 'PRESENTE'
              AND id_class IS NOT NULL
          GROUP BY id_student, date

          UNION
          
          SELECT
              id_student AS id,
              date,
              'false' AS register_by_another_class,
              'PRESENTE' AS status
          FROM frequency
          WHERE
              date = ${date}
              AND status = 'PRESENTE'
              AND id_class IS NULL
          GROUP BY id_student, date
      ),
      active_students AS (
          SELECT
              id,
              full_name
          FROM
              student
          WHERE
              status = 'ATIVO'
      )
      SELECT
          acs.id AS idStudent,
          acs.full_name AS fullName,
          CASE
              WHEN fq.date IS NULL THEN ${date}
              ELSE fq.date
          END AS date,
          CASE
              WHEN fq.register_by_another_class IS NULL THEN 'false'
              ELSE fq.register_by_another_class
          END AS registerByAnotherClass,
          CASE
              WHEN fq.status IS NULL THEN 'AUSENTE'
              ELSE fq.status
          END AS status
      FROM active_students AS acs
      LEFT JOIN freq_query AS fq
      ON acs.id = fq.id
    `;
    if(!result){
      return []
    }
    return result.map(arg=>FrequencyDTOMapper.toStudentGeneralFrequencyDTO(arg));
  }
}