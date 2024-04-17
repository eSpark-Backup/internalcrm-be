import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ParamIdDTO {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly id: number;
}
