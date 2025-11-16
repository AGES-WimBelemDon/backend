import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { ClassService } from "../application/class.service";
import { LevelService } from "src/modules/level/application/level.service";
import { EnrollmentService } from "src/modules/enrollment/application/enrollment.service";
import {
  CLASS_QUERIES_TOKEN,
  IClassQueries,
} from "../application/class.service.query.interfaces";
import {
  CLASS_REPOSITORY_TOKEN,
  IClassRepository,
} from "../domain/class.repository.interface";
import { DayOfWeek, ClassState } from "src/common/enums/domain.enums";
import { Class } from "../domain/class.entity";
import { Teacher } from "../domain/teacher";
import { Test } from "@nestjs/testing";

const baseDto: any = {
  name: "Music",
  activityId: 1,
  levelId: 1,
  teacherIds: [1],
  isRecurrent: true,
  dayOfWeek: [DayOfWeek.SEGUNDA],
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-03-01"),
  startTime: "09:00:00",
  endTime: "10:00:00",
};

const makeClass = (overrides: Partial<Class> = {}) =>
  new Class({
    id: overrides["id"] ?? 1,
    name: overrides["name"] ?? "Music",
    activityId: overrides["activityId"] ?? 1,
    levelId: overrides["levelId"] ?? 1,
    state: overrides["state"] ?? ClassState.ATIVA,
    teachers: overrides["teachers"] ?? [],
    isRecurrent: overrides["isRecurrent"] ?? false,
    startDate: overrides["startDate"] ?? new Date("2024-01-01"),
    endDate: overrides["endDate"],
    startTime:
      overrides["startTime"] ??
      new Date("1970-01-01T09:00:00.000Z"),
    endTime:
      overrides["endTime"] ??
      new Date("1970-01-01T10:00:00.000Z"),
    schedules: overrides["schedules"] ?? [],
  });

describe("ClassService", () => {
  let service: ClassService;
  let classRepository: jest.Mocked<IClassRepository>;
  let classQueries: jest.Mocked<IClassQueries>;
  let levelService: jest.Mocked<LevelService>;
  let enrollmentService: jest.Mocked<EnrollmentService>;

  beforeEach(async () => {
    classRepository = {
      create: jest.fn(),
      findClasses: jest.fn(),
      findMyClasses: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    classQueries = {
      getManyByTeacherId: jest.fn(),
    };
    levelService = {
      getById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<LevelService>;
    enrollmentService = {
      finishEnrollmentsByClassId: jest.fn(),
      createEnrollments: jest.fn(),
      findEnrollments: jest.fn(),
      reactivateEnrollment: jest.fn(),
      softDeleteEnrollment: jest.fn(),
    } as unknown as jest.Mocked<EnrollmentService>;

    const module = await Test.createTestingModule({
      providers: [
        ClassService,
        { provide: CLASS_REPOSITORY_TOKEN, useValue: classRepository },
        { provide: CLASS_QUERIES_TOKEN, useValue: classQueries },
        { provide: LevelService, useValue: levelService },
        { provide: EnrollmentService, useValue: enrollmentService },
      ],
    }).compile();

    service = module.get(ClassService);
  });

  it("should require dayOfWeek when class is recurrent", async () => {
    await expect(
      service.createClass({
        ...baseDto,
        dayOfWeek: [],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should validate start time format", async () => {
    await expect(
      service.createClass({
        ...baseDto,
        startTime: "25:00:00",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should create a class with valid payload", async () => {
    levelService.getById.mockResolvedValue({} as any);
    classQueries.getManyByTeacherId.mockResolvedValue([
      new Teacher(1, "Teacher"),
    ]);
    const createdClass = makeClass();
    classRepository.create.mockResolvedValue(createdClass);

    const result = await service.createClass(baseDto);

    expect(classRepository.create).toHaveBeenCalled();
    expect(result.name).toBe("Music");
  });

  it("should throw when updating unknown class", async () => {
    classRepository.findById.mockResolvedValue(null);

    await expect(
      service.update(1, { name: "Updated" } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("should reject invalid start time during update", async () => {
    classRepository.findById.mockResolvedValue(makeClass());

    await expect(
      service.update(1, { startTime: "30:00:00" } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should delete class logically and finish enrollments", async () => {
    const existing = makeClass({ id: 10, endDate: undefined });
    classRepository.findById.mockResolvedValue(existing);
    classRepository.update.mockResolvedValue(existing);

    const result = await service.deleteClass(10);

    expect(classRepository.update).toHaveBeenCalled();
    expect(enrollmentService.finishEnrollmentsByClassId).toHaveBeenCalledWith(
      10,
      expect.any(Date),
    );
    expect(result.id).toBe(10);
  });

  it("should not delete class already inactive", async () => {
    const existing = makeClass({ state: ClassState.INATIVA });
    classRepository.findById.mockResolvedValue(existing);

    await expect(service.deleteClass(1)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});

