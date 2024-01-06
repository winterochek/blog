import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserRequestBody {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(4, 255)
  name: string;

  @IsOptional()
  @IsString()
  @Length(4, 20)
  username: string;

  @IsOptional()
  @IsString()
  @Length(8, 21)
  password: string;
}
