import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTeamDTO {
  @ApiProperty({
    type: String,
    example: 'team name',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({
    type: String,
    example: 'team description',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly description: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly head: number;
}

export class UpdateTeamDTO extends PartialType(CreateTeamDTO) {}
