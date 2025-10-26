import { PartialType } from "@nestjs/swagger";
import { CreateClassDTO } from "./create-class.request.dto";
import { ClassState } from "src/common/enums/domain.enums";

export class UpdateClassDTO extends PartialType(CreateClassDTO) {
    state: ClassState
}