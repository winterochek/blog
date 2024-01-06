import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpUserRequestBody {
  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 255)
  name: string;

  @IsString()
  @Length(4, 20)
  username: string;

  @IsString()
  @Length(8, 21)
  password: string;
}
