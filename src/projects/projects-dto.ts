import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ProjectAssetType } from 'src/entities/projectAssets.entity';
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

export class UserIdsDTO {
  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  readonly userIds: number[];
}

export class UploadAssetDTO {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  readonly asset: Express.Multer.File;

  @ApiProperty({ type: String })
  @IsEnum(ProjectAssetType)
  @IsNotEmpty()
  readonly type: ProjectAssetType;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  readonly projectId: number;

  @ApiPropertyOptional({ type: String })
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  readonly link: string;
}

export class ProjectAssetTypeDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(ProjectAssetType)
  readonly type?: ProjectAssetType;
}
