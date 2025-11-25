import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { FrequencyService } from "../application/frequency.service";
import {
  FREQUENCY_QUERIES_TOKEN,
  IFrequencyQueries,
} from "../application/frequency.service.query.interfaces";
import {
  FREQUENCY_REPOSITORY_TOKEN,
  IFrequencyRepository,
} from "../domain/frequency.repository";
import { Frequency } from "../domain/frequency.entity";
import { FrequencyStatus } from "src/common/enums/domain.enums";

const sampleDate = new Date("2024-01-10");

describe("FrequencyService", () => {
  let service: FrequencyService;
  let repository: jest.Mocked<IFrequencyRepository>;
  let queries: jest.Mocked<IFrequencyQueries>;

  beforeEach(async () => {
    repository = {
      createMany: jest.fn(),
      deleteManyByStudentAndClassAndDate: jest.fn(),
      getByClassIdAnDate: jest.fn(),
      upsert: jest.fn(),
    };

    queries = {
      getGeneralAttendance: jest.fn(),
      getMyClasses: jest.fn(),
      getStudentByClassAndDateAttendanceList: jest.fn(),
      getStudentsByClassId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FrequencyService,
        { provide: FREQUENCY_REPOSITORY_TOKEN, useValue: repository },
        { provide: FREQUENCY_QUERIES_TOKEN, useValue: queries },
      ],
    }).compile();

    service = module.get(FrequencyService);
  });

  it("should append general class when fetching user classes", async () => {
    queries.getMyClasses.mockResolvedValue([
      {
        classId: 1,
        className: "Class A",
        classState: "ATIVA",
        levelName: "Level 1",
        isGeral: false,
        activity: { activityId: 10, activityName: "Futebol" },
      },
    ]);

    const result = await service.getUserClasses(9);

    expect(result.classes).toHaveLength(2);
    expect(result.classes[1]).toMatchObject({
      classId: null,
      className: "Geral",
      isGeral: true,
    });
  });

  it("should return general attendance list with formatted date", async () => {
    queries.getGeneralAttendance.mockResolvedValue([
      {
        studentId: 1,
        fullName: "Ana",
        generalAttendanceAllowed: true,
        status: FrequencyStatus.PRESENTE,
      },
    ]);

    const result = await service.getGeneralAttendance(sampleDate);

    expect(result.date).toBe("2024-01-10");
    expect(result.studentList).toHaveLength(1);
  });

  it("should throw BadRequest when general attendance payload is inconsistent", async () => {
    queries.getGeneralAttendance.mockResolvedValue([]);

    await expect(
      service.updateGeneralAttendance({
        date: sampleDate,
        studentList: [
          {
            studentId: 10,
            generalAttendanceAllowed: true,
            status: FrequencyStatus.PRESENTE,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should update general attendance when entries are valid", async () => {
    queries.getGeneralAttendance.mockResolvedValue([
      {
        studentId: 1,
        fullName: "Ana",
        generalAttendanceAllowed: true,
        status: FrequencyStatus.PRESENTE,
      },
      {
        studentId: 2,
        fullName: "Bea",
        generalAttendanceAllowed: true,
        status: FrequencyStatus.PRESENTE,
      },
    ]);
    repository.deleteManyByStudentAndClassAndDate.mockResolvedValue(true);
    repository.upsert.mockImplementation(async (frequency) => frequency);

    await service.updateGeneralAttendance({
      date: sampleDate,
      studentList: [
        {
          studentId: 1,
          generalAttendanceAllowed: true,
          status: FrequencyStatus.PRESENTE,
        },
        {
          studentId: 2,
          generalAttendanceAllowed: true,
          status: FrequencyStatus.AUSENTE,
        },
      ],
    });

    expect(repository.deleteManyByStudentAndClassAndDate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.any(Frequency),
      ]),
    );
    expect(repository.upsert).toHaveBeenCalledTimes(1);
  });

  it("should throw Conflict when attendance list already exists for a class/date", async () => {
    repository.getByClassIdAnDate.mockResolvedValue([
      new Frequency({
        id: 1,
        studentId: 1,
        classId: 1,
        date: sampleDate,
        status: FrequencyStatus.PRESENTE,
        notes: null,
      }),
    ]);

    await expect(
      service.createAttendanceList(sampleDate, 1),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("should throw NotFound when class has no enrolled students", async () => {
    repository.getByClassIdAnDate.mockResolvedValue([]);
    queries.getStudentsByClassId.mockResolvedValue([]);

    await expect(
      service.createAttendanceList(sampleDate, 1),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("should throw when cannot reset general attendance state before creation", async () => {
    repository.getByClassIdAnDate.mockResolvedValue([]);
    queries.getStudentsByClassId.mockResolvedValue([{ id: 5 }]);
    repository.deleteManyByStudentAndClassAndDate.mockResolvedValue(false);

    await expect(
      service.createAttendanceList(sampleDate, 2),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it("should throw when repository fails to create attendance entries", async () => {
    repository.getByClassIdAnDate.mockResolvedValue([]);
    queries.getStudentsByClassId.mockResolvedValue([{ id: 5 }]);
    repository.deleteManyByStudentAndClassAndDate.mockResolvedValue(true);
    repository.createMany.mockResolvedValue(false);

    await expect(
      service.createAttendanceList(sampleDate, 2),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it("should create attendance list when there are enrolled students", async () => {
    repository.getByClassIdAnDate.mockResolvedValue([]);
    queries.getStudentsByClassId.mockResolvedValue([{ id: 5 }]);
    repository.deleteManyByStudentAndClassAndDate.mockResolvedValue(true);
    repository.createMany.mockResolvedValue(true);
    queries.getStudentByClassAndDateAttendanceList.mockResolvedValue([
      {
        frequencyId: 1,
        studentId: 5,
        studentFullName: "Ana",
        attendancePercentage: 100,
        status: FrequencyStatus.PRESENTE,
        notes: null,
      },
    ]);

    const result = await service.createAttendanceList(sampleDate, 3);

    expect(repository.createMany).toHaveBeenCalled();
    expect(result).toEqual({
      classId: 3,
      date: "2024-01-10",
      studentList: expect.any(Array),
    });
  });

  it("should throw when updateAttendanceList receives an empty student list", async () => {
    await expect(
      service.updateAttendanceList({
        classId: 1,
        date: sampleDate,
        studentList: [],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should throw when attendance list was never created", async () => {
    repository.getByClassIdAnDate.mockResolvedValue([]);

    await expect(
      service.updateAttendanceList({
        classId: 1,
        date: sampleDate,
        studentList: [
          {
            frequencyId: 1,
            studentId: 1,
            status: FrequencyStatus.AUSENTE,
            notes: null,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should throw when trying to update a frequency not belonging to the list", async () => {
    repository.getByClassIdAnDate.mockResolvedValue([
      new Frequency({
        id: 99,
        studentId: 1,
        classId: 1,
        date: sampleDate,
        status: FrequencyStatus.PRESENTE,
        notes: null,
      }),
    ]);

    await expect(
      service.updateAttendanceList({
        classId: 1,
        date: sampleDate,
        studentList: [
          {
            frequencyId: 2,
            studentId: 1,
            status: FrequencyStatus.AUSENTE,
            notes: null,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should update attendance list and sync general attendance records", async () => {
    const existingFrequency = new Frequency({
      id: 1,
      studentId: 1,
      classId: 1,
      date: sampleDate,
      status: FrequencyStatus.AUSENTE,
      notes: null,
    });
    repository.getByClassIdAnDate.mockResolvedValue([existingFrequency]);
    repository.deleteManyByStudentAndClassAndDate.mockResolvedValue(true);
    repository.upsert.mockResolvedValue(existingFrequency);

    await service.updateAttendanceList({
      classId: 1,
      date: sampleDate,
      studentList: [
        {
          frequencyId: 1,
          studentId: 1,
          status: FrequencyStatus.PRESENTE,
          notes: null,
        },
      ],
    });

    expect(repository.upsert).toHaveBeenCalledWith(existingFrequency);
    expect(repository.deleteManyByStudentAndClassAndDate).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(Frequency)]),
    );
  });
});
