import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpAdminRequestBody {
  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 255)
  name: string;

  @IsString()
  @Length(8, 21)
  password: string;
}
