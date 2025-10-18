export class Answer {
  constructor(
    public readonly id: number,
    public readonly studentId: number,
    public readonly questionId: number,
    public readonly content: string,
    public readonly submissionDate: Date
  ) {}
}
