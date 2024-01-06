import { UseGuards, applyDecorators } from '@nestjs/common';
import { AdminJwtAuthGuard } from '../../common/guards';

export function Authenticated(): MethodDecorator {
  return applyDecorators(UseGuards(AdminJwtAuthGuard));
}
