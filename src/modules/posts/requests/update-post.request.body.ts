import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePostRequestBody {
  @IsOptional()
  @IsString()
  @Length(3, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(3)
  body?: string;
}
