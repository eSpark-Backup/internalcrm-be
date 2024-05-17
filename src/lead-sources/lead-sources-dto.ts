import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateLeadSourceDTO {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
