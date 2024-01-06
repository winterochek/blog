import { IsString, Length } from 'class-validator';

export class UserBlockRequestBody {
  @IsString()
  @Length(4, 255)
  reason: string;
}
