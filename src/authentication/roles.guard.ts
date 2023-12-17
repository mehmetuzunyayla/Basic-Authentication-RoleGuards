// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      // If no roles are specified, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming the user is attached to the request during authentication

    // Check if the user has at least one of the required roles
    return roles.some(role => user?.role === role);
  }
}
