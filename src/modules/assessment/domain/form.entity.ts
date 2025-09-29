export class Form {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly type: string,
    public readonly questions?: Question[],
  ) {}
}

export class Question {
  constructor(
    public readonly id: number,
    public readonly formId: number,
    public readonly text: string,
    public readonly required: boolean = false,
    public readonly order: number,
    public readonly helpText?: string,
    public readonly answers?: Answer[],
  ) {}
}

export class Answer {
  constructor(
    public readonly id: number,
    public readonly studentId: number,
    public readonly questionId: number,
    public readonly submission_date: Date,
    public readonly content: string,
  ) {}
}
