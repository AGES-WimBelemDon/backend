
import { Controller, Body, Get, Param, ParseIntPipe, Patch } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AddressService } from "../application/address.service";
import { UpdateAddressDTO } from "../application/update-address.dto";
import { AddressMapper } from "../infrastructure/address.mapper";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { StaffAndInterns, StaffOnly } from "src/common/decorators/common.roles.decorator";

@ApiTags('address')
@Controller('address')
@ApiBearerAuth("JWT-auth")
@StaffOnly()
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Get(':id')
    @StaffAndInterns()
    @ApiOperation({ summary: 'Search by address ID' })
    @ApiResponse({ status: 200, description: 'Address retrieved successfully.'})
    @ApiResponse({ status: 404, description: "Address not found!" })
    async findById(@Param('id', ParseIntPipe) id: number) {
        const address = await this.addressService.findById(id);
        return AddressMapper.toResponse(address);
    }
    
    @Patch(':id')
    @ApiOperation({ summary: 'Update an address' })
    @ApiResponse({status: 200, description: "Address successfully updated"})
    @ApiResponse({ status: 400, description: "Invalid Data! (Bad Request)" })
    @ApiResponse({ status: 404, description: "Address not found!" })
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAddressDTO) {
        const updatedAddress = await this.addressService.update(id, dto);
        return AddressMapper.toResponse(updatedAddress);
    }
}
