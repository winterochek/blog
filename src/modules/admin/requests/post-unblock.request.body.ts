import { IsString, Length } from 'class-validator';

export class PostUnblockRequestBody {
  @IsString()
  @Length(4, 255)
  reason: string;
}
