import { EmailVerifyToken } from 'src/entities';
import { UserDto } from './user.dto';

export class EmailVerifyTokenDto {
  id: number;
  userId: number;
  token: string;
  expired: boolean;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: UserDto;

  static fromEntity(evt: EmailVerifyToken): EmailVerifyTokenDto {
    return {
      id: evt.id,
      userId: evt.userId,
      token: evt.token,
      expired: evt.expired,
      used: evt.used,
      createdAt: evt.createdAt,
      updatedAt: evt.updatedAt,
      user: evt?.user ? UserDto.fromEntity(evt.user) : undefined,
    };
  }
}
