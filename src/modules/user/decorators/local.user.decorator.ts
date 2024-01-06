import { UseGuards, applyDecorators } from '@nestjs/common';
import { LocalAuthGuard } from 'src/modules/common/guards';

export function Local(): MethodDecorator {
  return applyDecorators(UseGuards(LocalAuthGuard));
}
