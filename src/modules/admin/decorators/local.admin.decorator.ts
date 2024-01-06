import { UseGuards, applyDecorators } from '@nestjs/common';
import { AdminLocalAuthGuard } from 'src/modules/common/guards';

export function Local(): MethodDecorator {
  return applyDecorators(UseGuards(AdminLocalAuthGuard));
}
