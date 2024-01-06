import { UseGuards, applyDecorators } from '@nestjs/common';
import {
  DisableBlockedUsersGuard,
  JwtAuthGuard,
} from 'src/modules/common/guards';

export function Authenticated(): MethodDecorator {
  return applyDecorators(UseGuards(JwtAuthGuard, DisableBlockedUsersGuard));
}
