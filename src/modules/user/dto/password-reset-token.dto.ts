import { PasswordResetToken } from 'src/entities';
import { UserDto } from './user.dto';

export class PasswordResetTokenDto {
  id: number;
  userId: number;
  token: string;
  expired: boolean;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: UserDto;

  static fromEntity(prt: PasswordResetToken): PasswordResetTokenDto {
    return {
      id: prt.id,
      userId: prt.userId,
      token: prt.token,
      expired: prt.expired,
      used: prt.used,
      createdAt: prt.createdAt,
      updatedAt: prt.updatedAt,
      user: prt?.user ? UserDto.fromEntity(prt.user) : undefined,
    };
  }
}
