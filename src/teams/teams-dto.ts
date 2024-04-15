import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTeamDTO {
  @ApiProperty({
    type: String,
    example: 'team name',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    example: 'team description',
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly head: number;
}

export class UpdateTeamDTO extends PartialType(CreateTeamDTO) {}

export class ParamIdDTO {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly id: number;
}
