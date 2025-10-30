import { UserStatus } from "src/common/enums/domain.enums";
import { Role } from "src/common/enums/roles.enum";
import { AddressEntity } from "src/modules/address/domain/address.entity";
import { Class } from "src/modules/class/domain/class.entity";

export class User {
  private id?: number;
  private uidFirebase: string;
  private fullName: string;
  private email: string;
  private role: Role;
  private addressId?: number | null;
  private createdAt: Date;
  private status: UserStatus;
  private address?: AddressEntity;
  private classes?: Class[];

  constructor(props: {
    id?: number;
    uidFirebase: string;
    fullName: string;
    email: string;
    role: Role;
    addressId?: number;
    createdAt?: Date;
    status?: UserStatus;
    address?: AddressEntity;
    classes?: Class[];
  }) {
    this.id = props.id;
    this.uidFirebase = props.uidFirebase;
    this.fullName = props.fullName;
    this.email = props.email;
    this.role = props.role;
    this.addressId = props.addressId;
    this.createdAt = props.createdAt ?? new Date();
    this.status = props.status ?? UserStatus.ATIVO;
    this.address = props.address;
    this.classes = props.classes;
  }
  getId(): number | undefined {
    return this.id;
  }

  getUidFirebase(): string {
    return this.uidFirebase;
  }

  getFullName(): string {
    return this.fullName;
  }

  getEmail(): string {
    return this.email;
  }

  getRole(): Role {
    return this.role;
  }

  getAddressId(): number | null | undefined {
    return this.addressId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getStatus(): UserStatus {
    return this.status;
  }

  getAddress(): AddressEntity | undefined {
    return this.address;
  }

  getClasses(): Class[] | undefined {
    return this.classes;
  }

  setId(id: number): void {
    this.id = id;
  }

  setUidFirebase(uidFirebase: string): void {
    this.uidFirebase = uidFirebase;
  }

  setFullName(fullName: string): void {
    this.fullName = fullName;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setRole(role: Role): void {
    this.role = role;
  }

  setAddressId(addressId: number): void {
    this.addressId = addressId;
  }

  setStatus(status: UserStatus): void {
    this.status = status;
  }

  setAddress(address: AddressEntity): void {
    this.address = address;
  }

  setClasses(classes: Class[]): void {
    this.classes = classes;
  }

  isActive(): boolean {
    return this.status === UserStatus.ATIVO;
  }

  deactivate(): void {
    this.status = UserStatus.INATIVO;
  }

  activate(): void {
    this.status = UserStatus.ATIVO;
  }
}