import { Admin } from 'src/entities';
import { UserBlockDto, UserUnBlockDto } from 'src/modules/user/dto';

export class AdminDto {
  public id: number;
  public email: string;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;
  public userBlocks?: UserBlockDto[];
  public userUnBlocks?: UserUnBlockDto[];
  //   public postBlocks?: PostBlockDto[];
  //   public postUnBlocks?: PostUnBlockDto[];
  static fromEntity(admin: Admin): AdminDto {
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      userBlocks: admin?.userBlocks
        ? admin.userBlocks.map(UserBlockDto.fromEntity)
        : undefined,
      userUnBlocks: admin?.userUnBlocks
        ? admin.userUnBlocks.map(UserUnBlockDto.fromEntity)
        : undefined,
    };
  }
}
