import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCardDTO {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly projectId: number;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
export class ProjectIdDTO {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly projectId: number;
}

export class UpdateCardDTO extends PickType(CreateCardDTO, ['name'] as const) {}
