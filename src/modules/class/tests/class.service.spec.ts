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
    levelService.getById.mockResolvedValue({} as any);
    classQueries.getManyByTeacherId.mockResolvedValue([
      new Teacher(1, "Teacher"),
    ]);
    
    await expect(
      service.createClass({
        ...baseDto,
        dayOfWeek: [],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should validate start time format", async () => {
    levelService.getById.mockResolvedValue({} as any);
    classQueries.getManyByTeacherId.mockResolvedValue([
      new Teacher(1, "Teacher"),
    ]);
    
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

  it("should validate end time format", async () => {
    levelService.getById.mockResolvedValue({} as any);
    classQueries.getManyByTeacherId.mockResolvedValue([
      new Teacher(1, "Teacher"),
    ]);

    await expect(
      service.createClass({
        ...baseDto,
        endTime: "25:00:00",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should reject invalid end time during update", async () => {
    classRepository.findById.mockResolvedValue(makeClass());

    await expect(
      service.update(1, { endTime: "30:00:00" } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should throw when invalid teacher IDs are provided", async () => {
    levelService.getById.mockResolvedValue({} as any);
    classQueries.getManyByTeacherId.mockResolvedValue([
      new Teacher(1, "Teacher"),
    ]);

    await expect(
      service.createClass({
        ...baseDto,
        teacherIds: [1, 999],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should create class without teachers when no teacherIds provided", async () => {
    levelService.getById.mockResolvedValue({} as any);
    classQueries.getManyByTeacherId.mockResolvedValue([]);
    const createdClass = makeClass({ teachers: [] });
    classRepository.create.mockResolvedValue(createdClass);

    const result = await service.createClass({
      ...baseDto,
      teacherIds: [],
    });

    expect(result).toBeDefined();
  });

  it("should create class without schedules when dayOfWeek is empty and not recurrent", async () => {
    levelService.getById.mockResolvedValue({} as any);
    classQueries.getManyByTeacherId.mockResolvedValue([
      new Teacher(1, "Teacher"),
    ]);
    const createdClass = makeClass({ schedules: [] });
    classRepository.create.mockResolvedValue(createdClass);

    const result = await service.createClass({
      ...baseDto,
      isRecurrent: false,
      dayOfWeek: [],
    });

    expect(result).toBeDefined();
  });

  it("should update class with new level", async () => {
    const existing = makeClass();
    classRepository.findById.mockResolvedValue(existing);
    levelService.getById.mockResolvedValue({} as any);
    classQueries.getManyByTeacherId.mockResolvedValue([]);
    classRepository.update.mockResolvedValue(existing);

    await service.update(1, { levelId: 2 });

    expect(levelService.getById).toHaveBeenCalledWith(2);
  });

  it("should require dayOfWeek when updating to recurrent class", async () => {
    const existing = makeClass();
    classRepository.findById.mockResolvedValue(existing);

    await expect(
      service.update(1, { isRecurrent: true, dayOfWeek: [] }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should clear schedules when dayOfWeek is set to null", async () => {
    const existing = makeClass();
    classRepository.findById.mockResolvedValue(existing);
    classQueries.getManyByTeacherId.mockResolvedValue([]);
    classRepository.update.mockResolvedValue(existing);

    await service.update(1, { dayOfWeek: null as any });

    expect(classRepository.update).toHaveBeenCalled();
  });

  it("should update multiple class properties at once", async () => {
    const existing = makeClass();
    classRepository.findById.mockResolvedValue(existing);
    levelService.getById.mockResolvedValue({} as any);
    classQueries.getManyByTeacherId.mockResolvedValue([
      new Teacher(1, "Teacher"),
    ]);
    classRepository.update.mockResolvedValue(existing);

    await service.update(1, {
      name: "Updated Class",
      activityId: 2,
      levelId: 3,
      isRecurrent: false,
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-12-01"),
      state: ClassState.INATIVA,
      startTime: "10:00:00",
      endTime: "11:00:00",
      teacherIds: [1],
      dayOfWeek: [DayOfWeek.TERCA],
    });

    expect(classRepository.update).toHaveBeenCalled();
  });

  it("should find classes by filters", async () => {
    const classes = [makeClass()];
    classRepository.findClasses.mockResolvedValue(classes);

    const result = await service.findClasses({ state: ClassState.ATIVA });

    expect(result).toHaveLength(1);
    expect(classRepository.findClasses).toHaveBeenCalledWith({
      state: ClassState.ATIVA,
    });
  });

  it("should find user's classes", async () => {
    const classes = [makeClass()];
    classRepository.findMyClasses.mockResolvedValue(classes);

    const result = await service.findMyClasses(1, {
      state: ClassState.ATIVA,
    });

    expect(result).toHaveLength(1);
    expect(classRepository.findMyClasses).toHaveBeenCalledWith(1, {
      state: ClassState.ATIVA,
    });
  });

  it("should find class by id", async () => {
    const classInstance = makeClass();
    classRepository.findById.mockResolvedValue(classInstance);

    const result = await service.findById(1);

    expect(result).toBe(classInstance);
  });

  it("should delete class with existing endDate", async () => {
    const existingEndDate = new Date("2024-12-31");
    const existing = makeClass({ id: 5, endDate: existingEndDate });
    classRepository.findById.mockResolvedValue(existing);
    classRepository.update.mockResolvedValue(existing);

    const result = await service.deleteClass(5);

    expect(enrollmentService.finishEnrollmentsByClassId).toHaveBeenCalledWith(
      5,
      existingEndDate,
    );
    expect(result.endDate).toBe("2024-12-31");
  });
});

