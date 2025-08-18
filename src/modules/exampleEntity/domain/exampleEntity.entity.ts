import { createId } from "@paralleldrive/cuid2"
interface ExampleEntityProps {
    name: string;
    email: string;
    birthDate: Date;
    id?: string;
}
export class ExampleEntity{
    id: string
    name  : string
    email : string
    birthDate : Date
    constructor(props: ExampleEntityProps) {
        this.id = props.id ?? createId()
        this.name = props.name;
        this.email = props.email;
        this.birthDate = props.birthDate;
    }
    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getBirthDate(): Date {
        return this.birthDate;
    }

    setId(id: string): void {
        this.id = id;
    }

    setName(name: string): void {
        this.name = name;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setBirthDate(birthDate: Date): void {
        this.birthDate = birthDate;
    }
}