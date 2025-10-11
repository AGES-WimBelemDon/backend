import { Module } from "@nestjs/common";
import { AddressService } from './application/address.service';
import { AddressController } from "./presentation/address.controller";
import { PrismaAddressRepository } from "./infrastructure/address.repository";
import { ADDRESS_REPOSITORY_TOKEN } from "./domain/address.repository.interface";

@Module({
    imports: [],
    controllers: [AddressController],
    providers: [
        AddressService,
        {
            provide: ADDRESS_REPOSITORY_TOKEN,
            useClass: PrismaAddressRepository,
        }
    ],
    exports: [AddressService, ADDRESS_REPOSITORY_TOKEN],
})
export class AddressModule {}
