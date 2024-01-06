import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserRequestBody {
  @IsOptional()
  @IsEmail()
  public email: string;

  @IsOptional()
  @IsString()
  @Length(4, 255)
  public name: string;

  @IsOptional()
  @IsString()
  @Length(4, 20)
  public username: string;

  @IsOptional()
  @IsString()
  @Length(8, 21)
  public password: string;

  excludeSensitiveFields(): Partial<UpdateUserRequestBody> {
    return {
      name: this.name,
      username: this.username,
    };
  }
}
