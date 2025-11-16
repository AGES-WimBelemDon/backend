import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AssessmentService } from "../application/assessment.service";
import { IAssessmentRepository } from "../domain/assessment-repository.interface";
import { StudentService } from "src/modules/student/application/student.service";
import { FormType } from "src/common/enums/domain.enums";
import { Answer } from "../domain/answer.entity";
import { Question } from "../domain/question.entity";
import { Form } from "../domain/form.entity";

const makeAnswer = (overrides: Partial<Answer> = {}) =>
  new Answer(
    overrides["id"] ?? 1,
    overrides["studentId"] ?? 1,
    overrides["questionId"] ?? 1,
    overrides["content"] ?? "content",
    overrides["submissionDate"] ?? new Date("2024-01-01"),
  );

const makeQuestion = (id: number) =>
  new Question(id, 1, `Question ${id}`, true);

describe("AssessmentService", () => {
  let repository: jest.Mocked<IAssessmentRepository>;
  let studentService: jest.Mocked<StudentService>;
  let service: AssessmentService;

  const submissionDate = new Date("2024-01-01");

  beforeEach(() => {
    repository = {
      findAllForms: jest.fn(),
      findQuestionsByFormType: jest.fn(),
      findQuestionsByIds: jest.fn(),
      findAnswersByQuestionsIdsAndStudentId: jest.fn(),
      createAnswers: jest.fn(),
      findAnswersByStudentAndFormType: jest.fn(),
      findAnswersByIds: jest.fn(),
      removeAnswersByIds: jest.fn(),
      updateAnswers: jest.fn(),
        updateAnswerContent: jest.fn(),
    };
    studentService = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<StudentService>;

    service = new AssessmentService(
      repository as unknown as IAssessmentRepository,
      studentService,
    );
  });

  it("should throw when student does not exist during answer creation", async () => {
    studentService.findById.mockResolvedValue(null);

    await expect(
      service.createAnswers(1, {
        submissionDate,
        answers: [{ questionId: 1, content: "A" }],
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("should reject duplicated question ids for the same submission date", async () => {
    studentService.findById.mockResolvedValue({} as any);

    await expect(
      service.createAnswers(1, {
        submissionDate,
        answers: [
          { questionId: 1, content: "A" },
          { questionId: 1, content: "B" },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should validate question ids before creating answers", async () => {
    studentService.findById.mockResolvedValue({} as any);
    repository.findQuestionsByIds.mockResolvedValue([makeQuestion(1)]);

    await expect(
      service.createAnswers(1, {
        submissionDate,
        answers: [
          { questionId: 1, content: "A" },
          { questionId: 2, content: "B" },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should prevent duplicate answers when already stored", async () => {
    studentService.findById.mockResolvedValue({} as any);
    repository.findQuestionsByIds.mockResolvedValue([
      makeQuestion(1),
      makeQuestion(2),
    ]);
    repository.findAnswersByQuestionsIdsAndStudentId.mockResolvedValue([
      makeAnswer({ questionId: 1 }),
    ]);

    await expect(
      service.createAnswers(1, {
        submissionDate,
        answers: [
          { questionId: 1, content: "A" },
          { questionId: 2, content: "B" },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should create answers when payload is valid", async () => {
    studentService.findById.mockResolvedValue({} as any);
    repository.findQuestionsByIds.mockResolvedValue([
      makeQuestion(1),
      makeQuestion(2),
    ]);
    repository.findAnswersByQuestionsIdsAndStudentId.mockResolvedValue([]);
    const created = [makeAnswer({ id: 10 }), makeAnswer({ id: 11 })];
    repository.createAnswers.mockResolvedValue(created);

    const result = await service.createAnswers(5, {
      submissionDate,
      answers: [
        { questionId: 1, content: "A" },
        { questionId: 2, content: "B" },
      ],
    });

    expect(repository.createAnswers).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(Answer)]),
    );
    expect(result).toEqual(created);
  });

  it("should fetch forms and questions through repository", async () => {
    const forms = [new Form(1, "Form", FormType.PSICOLOGIA)];
    repository.findAllForms.mockResolvedValue(forms);
    repository.findQuestionsByFormType.mockResolvedValue([makeQuestion(1)]);

    const retrievedForms = await service.getAllForms();
    const retrievedQuestions = await service.getQuestionsByFormType(
      FormType.PSICOLOGIA,
    );

    expect(retrievedForms).toBe(forms);
    expect(retrievedQuestions).toHaveLength(1);
  });

  it("should throw when fetching answers for nonexistent student", async () => {
    studentService.findById.mockResolvedValue(null);

    await expect(
      service.getAnswersByStudentAndFormType(1, FormType.PSICOLOGIA),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("should return answers for existing student and form type", async () => {
    studentService.findById.mockResolvedValue({} as any);
    const answers = [makeAnswer({ id: 99 })];
    repository.findAnswersByStudentAndFormType.mockResolvedValue(answers);

    const result = await service.getAnswersByStudentAndFormType(
      1,
      FormType.PSICOLOGIA,
    );

    expect(result).toBe(answers);
  });

  it("should validate answer ids before bulk update", async () => {
    repository.findAnswersByIds.mockResolvedValue([makeAnswer({ id: 1 })]);

    await expect(
      service.bulkUpdateAnswer({
        updates: [
          { answerId: 1, content: "Updated" },
          { answerId: 2, content: "Updated" },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should remove answers when content is null in bulk update", async () => {
    repository.findAnswersByIds.mockResolvedValue([makeAnswer({ id: 1 })]);
    repository.removeAnswersByIds.mockResolvedValue();

    await service.bulkUpdateAnswer({
      updates: [{ answerId: 1, content: null as any }],
    });

    expect(repository.removeAnswersByIds).toHaveBeenCalledWith([1]);
  });

  it("should update answers merging existing values", async () => {
    const existing = makeAnswer({ id: 1, studentId: 7, questionId: 9 });
    repository.findAnswersByIds.mockResolvedValue([existing]);
    repository.updateAnswers.mockResolvedValue([existing]);

    const result = await service.bulkUpdateAnswer({
      updates: [
        {
          answerId: 1,
          content: "New content",
          submissionDate: new Date("2024-02-02"),
        },
      ],
    });

    expect(repository.updateAnswers).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(Answer)]),
    );
    expect(result).toEqual([existing]);
  });
});
