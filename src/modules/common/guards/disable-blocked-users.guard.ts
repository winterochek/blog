import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/entities';

@Injectable()
export class DisableBlockedUsersGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: User }>();
    if (request?.user) {
      const isBlocked = request.user.blocked;
      return !isBlocked;
    }
    return true;
  }
}
