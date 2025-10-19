import { Answer } from "./answer.entity";

export class Question {
  constructor(
    public readonly id: number,
    public readonly formId: number,
    public readonly statement: string,
    public readonly isRequired: boolean,
    public readonly answers: Answer[] = [],
  ) {}
}
