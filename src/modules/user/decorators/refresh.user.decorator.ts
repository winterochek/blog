import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtRefreshAuthGuard } from 'src/modules/common/guards';

export function Refresh(): MethodDecorator {
  return applyDecorators(UseGuards(JwtRefreshAuthGuard));
}
