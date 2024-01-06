import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  getAccessTokenCookie(userId: number, empty = false): string {
    if (Boolean(empty)) {
      return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
    }
    const payload: JwtPayload = { userId };
    const token = this.jwtService.sign(payload, { expiresIn: '120s' });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=120`;
  }

  getRefreshTokenCookieAndToken(
    userId: number,
    empty = false,
  ): { token: string; cookie: string } {
    if (Boolean(empty)) {
      return { cookie: 'Refresh=; HttpOnly; Path=/; Max-Age=0', token: '' };
    }
    const payload: JwtPayload = { userId };
    const token = this.jwtService.sign(payload, { expiresIn: '600s' });
    return {
      token,
      cookie: `Refresh=${token}; HttpOnly; Path=/; Max-Age=600}`,
    };
  }

  setHeaders(
    response: Response,
    userId?: number,
    empty = false,
  ): { refreshToken: string } {
    const accessTokenCookie = this.getAccessTokenCookie(userId, empty);
    const { token: refreshToken, cookie: refreshTokenCookie } =
      this.getRefreshTokenCookieAndToken(userId, empty);
    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return { refreshToken };
  }
}
