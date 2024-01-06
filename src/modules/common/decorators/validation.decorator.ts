import { UsePipes, ValidationPipe, applyDecorators } from '@nestjs/common';

export function Validated(): MethodDecorator {
  return applyDecorators(UsePipes(ValidationPipe));
}
