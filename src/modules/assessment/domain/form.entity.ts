import { FormType } from "src/common/enums/domain.enums";
import { Question } from "./question.entity";

export class Form {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly type: FormType,
    public readonly questions: Question[] = []
  ) {}
}
