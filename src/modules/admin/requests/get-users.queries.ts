import { IsBoolean, IsOptional } from 'class-validator';

export class GetUsersQueryOptions {
  @IsOptional()
  @IsBoolean()
  blocked: boolean = false;
}
