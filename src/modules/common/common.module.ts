import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import {
  AdminJwtRefreshStrategy,
  AdminJwtStrategy,
  AdminLocalStrategy,
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy,
} from './auth-strategies';
import {
  AdminJwtAuthGuard,
  AdminLocalAuthGuard,
  JwtAuthGuard,
  LocalAuthGuard,
} from './guards';
import { Authenticated, Validated } from './decorators';
import { UuidModule } from 'nestjs-uuid';

@Module({
  imports: [UuidModule],
  providers: [
    AuthService,
    LocalStrategy,
    AdminLocalStrategy,
    JwtStrategy,
    AdminJwtStrategy,
    JwtRefreshStrategy,
    AdminJwtRefreshStrategy,
    JwtAuthGuard,
    AdminJwtAuthGuard,
    LocalAuthGuard,
    AdminLocalAuthGuard,
  ],
  exports: [Validated, Authenticated, AuthService],
})
export class CommonModule {}
