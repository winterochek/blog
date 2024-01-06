import { IsString, Length } from 'class-validator';

export class PostBlockRequestBody {
  @IsString()
  @Length(4, 255)
  reason: string;
}
