import { IsEmail, IsString, Length } from 'class-validator';

export class SignInUserRequestBody {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 21)
  password: string;
}
