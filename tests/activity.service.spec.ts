import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { ActivityService } from "src/modules/activity/application/activity.service";
import { IActivityRepository } from "src/modules/activity/domain/activity-repository.interface";
import { Activity } from "src/modules/activity/domain/activity.entity";

describe("ActivityService", () => {
  let repository: jest.Mocked<IActivityRepository>;
  let service: ActivityService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
    };

    service = new ActivityService(repository as unknown as IActivityRepository);
  });

  it("should create a new activity when name is unique and valid", async () => {
    repository.findByName.mockResolvedValue(null);
    const created = new Activity(1, "Sports");
    repository.create.mockResolvedValue(created);

    const result = await service.create({ name: "  Sports  " });

    expect(repository.findByName).toHaveBeenCalledWith("Sports");
    expect(repository.create).toHaveBeenCalledWith(expect.any(Activity));
    expect(result).toBe(created);
  });

  it("should throw BadRequest when name is empty after trim", async () => {
    await expect(service.create({ name: "   " })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.findByName).not.toHaveBeenCalled();
  });

  it("should throw Conflict when activity name already exists", async () => {
    repository.findByName.mockResolvedValue(new Activity(1, "Sports"));

    await expect(service.create({ name: "Sports" })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("should return all activities", async () => {
    const list = [new Activity(1, "Sports")];
    repository.findAll.mockResolvedValue(list);

    const result = await service.findAll();

    expect(result).toEqual(list);
  });

  it("should throw NotFound when updating unknown activity", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.update(123, { name: "Yoga" })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("should throw BadRequest when updated name is blank", async () => {
    repository.findById.mockResolvedValue(new Activity(1, "Old"));

    await expect(service.update(1, { name: " " })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("should throw Conflict when another activity already uses the name", async () => {
    const existing = new Activity(1, "Old");
    repository.findById.mockResolvedValue(existing);
    repository.findByName.mockResolvedValue(new Activity(2, "New Name"));

    await expect(service.update(1, { name: "New Name" })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("should update activity name when validation passes", async () => {
    const existing = new Activity(1, "Old");
    repository.findById.mockResolvedValue(existing);
    repository.findByName.mockResolvedValue(existing);
    const updated = new Activity(1, "Updated");
    repository.update.mockResolvedValue(updated);

    const result = await service.update(1, { name: "Updated" });

    expect(repository.findByName).toHaveBeenCalledWith("Updated");
    expect(repository.update).toHaveBeenCalledWith(existing);
    expect(result).toBe(updated);
  });
});
