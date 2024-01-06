import { UserBlock } from 'src/entities';
import { UserDto } from 'src/modules/user/dto';
import { AdminDto } from './admin.dto';

export class UserBlockDto {
  public id: number;
  public userId: number;
  public adminId: number;
  public user?: UserDto;
  public admin?: AdminDto;
  public createdAt: Date;
  public updatedAt: Date;
  static fromEntity(userBlock: UserBlock): UserBlockDto {
    return {
      id: userBlock.id,
      userId: userBlock.userId,
      adminId: userBlock.adminId,
      user: userBlock?.user ? UserDto.fromEntity(userBlock.user) : undefined,
      admin: userBlock?.admin
        ? AdminDto.fromEntity(userBlock.admin)
        : undefined,
      createdAt: userBlock.createdAt,
      updatedAt: userBlock.updatedAt,
    };
  }
}
