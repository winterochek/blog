import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentRequestBody {
  @IsOptional()
  @IsString()
  @Length(3, 255)
  title?: string;

  @IsString()
  @Length(3)
  body: string;

  @IsInt()
  postId: number;
}
