import { IsEmail } from 'class-validator';

export class UpdateUserEmailRequestBody {
  @IsEmail()
  email: string;
}
