import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.role) {
      return false;
    }

    // Convert required roles and user role to lowercase to handle consistency
    const userRole = user.role.toLowerCase();
    
    // Superadmin has access to everything a regular admin has
    if (userRole === 'superadmin') {
      return true;
    }

    return requiredRoles.map(role => role.toLowerCase()).includes(userRole);
  }
}
