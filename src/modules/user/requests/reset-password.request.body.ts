import { IsEmail, IsString, Length } from 'class-validator';

export class CreateResetPasswordRequestBody {
  @IsEmail()
  email: string;
}

export class UseResetPasswordRequestBody {
  @IsString()
  @Length(8, 21)
  password: string;
}
