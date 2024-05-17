import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateLeadDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  readonly documentFile: Express.Multer.File;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  readonly sourceId: number;
}
export class UpdateLeadDTO extends PartialType(CreateLeadDTO) {}