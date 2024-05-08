import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TaskStatus } from 'src/entities/tasks.entity';

export class CreateTaskDTO {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  readonly cardId: number;

  @ApiPropertyOptional({
    type: String,
    example: 'Task description',
  })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({
    type: String,
    example: 'Task description',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    example: new Date(),
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    type: String,
    example: new Date(),
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  readonly assignedTo: number;
}

export class QueryParamDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(['true', 'false'])
  readonly deleted: boolean;
}
export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {
  @ApiPropertyOptional({
    type: String,
    example: new Date(),
  })
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  readonly completedAt?: Date;

  @ApiPropertyOptional({
    type: String,
    example: TaskStatus.pending,
  })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  @IsOptional()
  readonly status?: TaskStatus;
}

export class AddCommentDTO {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  readonly taskId: number;

  @ApiProperty({
    type: String,
    example: 'Comment',
  })
  @IsString()
  @IsNotEmpty()
  readonly comment: string;
}

export class EditCommentDTO extends PickType(AddCommentDTO, [
  'comment',
] as const) {}
