import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Admin, User } from 'src/entities';
import { AdminService } from 'src/modules/admin/admin.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }
  async validate(email: string, password: string): Promise<User> {
    return this.userService.validateByCredentials(email, password);
  }
}

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminService: AdminService) {
    super();
  }
  async validate(email: string, password: string): Promise<Admin> {
    return this.adminService.validateByCredentials(email, password);
  }
}
