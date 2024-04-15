import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProjectDTO {
  @ApiProperty({
    type: String,
    example: 'project name',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    example: 'project description',
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    type: String,
    example: new Date(),
  })
  @IsDateString()
  @IsNotEmpty()
  startingDate: Date;
}

export class UpdateProjectDTO extends PartialType(CreateProjectDTO) {}
