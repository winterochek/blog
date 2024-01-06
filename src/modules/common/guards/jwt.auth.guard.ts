import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('refresh') {}

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('admin') {}

@Injectable()
export class AdminJwtRefreshAuthGuard extends AuthGuard('admin-refresh') {}
