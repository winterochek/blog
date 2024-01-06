import { IsString, Length } from 'class-validator';

export class UserUnblockRequestBody {
  @IsString()
  @Length(4, 255)
  reason: string;
}
