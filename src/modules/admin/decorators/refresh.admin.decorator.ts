import { UseGuards, applyDecorators } from '@nestjs/common';
import { AdminJwtRefreshAuthGuard } from 'src/modules/common/guards';

export function Refresh(): MethodDecorator {
  return applyDecorators(UseGuards(AdminJwtRefreshAuthGuard));
}
