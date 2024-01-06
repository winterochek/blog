import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCommentRequestBody {
  @IsOptional()
  @IsString()
  @Length(3, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(3)
  body: string;

  @IsInt()
  postId: number;
}
