interface LevelProps{
    id?: number
    name: string
    description?: string | null
}
export class Level {
    private id?: number
    private name: string
    private description?: string | null
    constructor(props: LevelProps){
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
    }
    public getId(): number | undefined{
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getDescription(): string | undefined | null{
        return this.description;
    }
    public setName(name: string){
        this.name = name;
    }
    public setDescription(description: string){
        this.description = description;
    }
}