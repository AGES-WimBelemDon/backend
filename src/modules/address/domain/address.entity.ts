
interface AddressProps {
    street: string;
    city: string;
    state: string;
    cep: string;
    neighborhood: string;
    number?: string;
    complement?: string;
    id?: number;
}

export class AddressEntity {
    id?: number;
    street: string;
    city: string;
    state: string;
    cep: string;
    neighborhood: string;
    number?: string;
    complement?: string;

    constructor(props: AddressProps) {
        this.id = props.id;
        this.street = props.street;
        this.city = props.city;
        this.state = props.state;
        this.cep = props.cep;
        this.neighborhood = props.neighborhood;
        this.number = props.number;
        this.complement = props.complement;
    }

    getId(): number | undefined {
        return this.id;
    }
    
    getStreet(): string {
        return this.street;
    }
    getCity(): string {
        return this.city;
    }
    getState(): string {
        return this.state;
    }
    getCep(): string {
        return this.cep;
    }
    getNeighborhood(): string {
        return this.neighborhood;
    }
    getNumber(): string | undefined {
        return this.number;
    }
    getComplement(): string | undefined {
        return this.complement;
    }
    
    setStreet(street: string): void {
        this.street = street;
    }
    setCity(city: string): void {
        this.city = city;
    }
    setState(state: string): void {
        this.state = state;
    }
    setCep(cep: string): void {
        this.cep = cep;
    }
    setNeighborhood(neighborhood: string): void {
        this.neighborhood = neighborhood;
    }
    setNumber(number: string): void {
        this.number = number;
    }
    setComplement(complement: string): void {
        this.complement = complement;
    }
}