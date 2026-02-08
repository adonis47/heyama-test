import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateObjectDto {
  @ApiProperty({ example: 'My Object Title' })
  @IsString()
  @MinLength(1, { message: 'Title is required' })
  @MaxLength(200, { message: 'Title must be at most 200 characters' })
  title!: string;

  @ApiProperty({ example: 'A detailed description of the object' })
  @IsString()
  @MinLength(1, { message: 'Description is required' })
  @MaxLength(2000, { message: 'Description must be at most 2000 characters' })
  description!: string;
}
