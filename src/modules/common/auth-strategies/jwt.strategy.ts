import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';
import { AdminService } from 'src/modules/admin/admin.service';
import { JwtPayload, AdminJwtPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request & { cookies?: { Authentication?: string } }) => {
          return request?.cookies.Authentication;
        },
      ]),
    });
  }

  async validate(payload: JwtPayload) {
    return this.userService.getById(payload.userId);
  }
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private readonly adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request & { cookies?: { Authentication?: string } }) => {
          return request?.cookies.Authentication;
        },
      ]),
    });
  }

  async validate(payload: AdminJwtPayload) {
    return this.adminService.getById(payload.adminId);
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request & { cookies?: { Refresh?: string } }) => {
          return request?.cookies?.Refresh;
        },
      ]),
      passReqToCallback: true,
    });
  }
  async validate(
    request: Request & { cookies?: { Refresh?: string } },
    payload: JwtPayload,
  ) {
    const refreshToken = request.cookies?.Refresh;
    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId,
    );
  }
}
@Injectable()
export class AdminJwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'admin-refresh',
) {
  constructor(private readonly adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request & { cookies?: { Refresh?: string } }) => {
          return request?.cookies?.Refresh;
        },
      ]),
      passReqToCallback: true,
    });
  }
  async validate(
    request: Request & { cookies?: { Refresh?: string } },
    payload: AdminJwtPayload,
  ) {
    const refreshToken = request.cookies?.Refresh;
    return this.adminService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.adminId,
    );
  }
}
