export class Form {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly type: string
  ) {}
}

export class Question {
  constructor(
    public readonly id: number,
    public readonly formId: number,
    public readonly statement: string,
    public readonly isRequired: boolean
  ) {}
}

export class Answer {
  constructor(
    public readonly id: number,
    public readonly studentId: number,
    public readonly questionId: number,
    public readonly content: string
  ) {}
}
