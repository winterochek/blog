import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePostRequestBody {
  @IsString()
  @Length(3, 255)
  title: string;

  @IsString()
  @Length(3)
  body: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Length(3, 21, { each: true })
  tags?: string[];
}
