export class Activity {
  constructor(
    private readonly id: number | undefined,
    private name: string,
  ) {}

  getId(): number | undefined {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }
}
