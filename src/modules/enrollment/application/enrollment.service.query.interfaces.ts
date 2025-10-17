import { EnrollmentListItemDTO } from "./dtos";

export const ENROLLMENT_QUERIES_TOKEN = "IEnrollmentQueries";

export interface EnrollmentQueryFilters {
  classId?: number;
  studentId?: number;
  endDateNull?: boolean;
  studentStatus?: "ATIVO" | "INATIVO" | "ALL";
}

export interface IEnrollmentQueries {
  findEnrollments(filters: EnrollmentQueryFilters): Promise<EnrollmentListItemDTO[]>;
}
