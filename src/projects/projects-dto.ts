import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ParamIdDTO } from 'src/utils/id-dto';

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

export class AddMembersDTO {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly projectId: number;

  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  readonly userIds: number[];
}
export class UserIdDTO extends ParamIdDTO {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly userId: number;
}
