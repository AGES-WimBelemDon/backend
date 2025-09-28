
interface ClassProps {
    name: string;
    activityId: number;
    levelId: number;
    state: string;
    studentsIds?: number[];
    teacherIds?: number[];
    id?: number;
}

export class Class {
    id?: number;
    name: string;
    activityId: number;
    levelId: number;
    state: string;
    studentsIds: number[];
    teacherIds: number[];

    constructor(props: ClassProps) {
        this.id = props.id;
        this.name = props.name;
        this.activityId = props.activityId;
        this.levelId = props.levelId;
        this.state = props.state;
        this.studentsIds = props.studentsIds || [];
        this.teacherIds = props.teacherIds || [];
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getActivityId(): number {
        return this.activityId;
    }

    getLevelId(): number {
        return this.levelId;
    }

    getState(): string {
        return this.state;
    }

    getStudentsIds(): number[] {
        return this.studentsIds;
    }

    getTeacherIds(): number[] {
        return this.teacherIds;
    }

    setName(name: string): void {
        this.name = name;
    }

    setActivityId(activityId: number): void {
        this.activityId = activityId;
    }

    setLevelId(levelId: number): void {
        this.levelId = levelId;
    }

    setState(state: string): void {
        this.state = state;
    }

    setStudentsIds(studentsIds: number[]): void {
        this.studentsIds = studentsIds;
    }

    setTeacherIds(teacherIds: number[]): void {
        this.teacherIds = teacherIds;
    }
}
