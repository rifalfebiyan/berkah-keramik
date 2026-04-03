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

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    
    if (!user || !user.role) {
      console.warn('RolesGuard: User not found or role missing in request', { 
        hasUser: !!user, 
        role: user?.role 
      });
      return false;
    }

    const userRole = String(user.role).toUpperCase();
    const normalizedRequiredRoles = requiredRoles.map(role => role.toUpperCase());

    const hasPermission = userRole === 'SUPERADMIN' || normalizedRequiredRoles.includes(userRole);

    if (!hasPermission) {
      console.warn(`RolesGuard: Access denied for role [${userRole}]. Required: [${normalizedRequiredRoles.join(', ')}]`);
    }

    return hasPermission;
  }
}
