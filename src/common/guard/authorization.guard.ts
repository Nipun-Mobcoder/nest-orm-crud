import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserNotFoundException } from '../exceptions/UserNotFoundException';
import { Reflector } from '@nestjs/core';
import { Permission } from 'src/modules/roles/dto/roles.dto';
import { UsersRepository } from 'src/modules/users/users.repositories';
import { PermissionNotProvidedException } from '../exceptions/PermissionNotProvidedException';
import { Roles } from 'src/modules/roles/entities/roles.entities';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userRepository: UsersRepository,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | Promise<boolean> | Observable<boolean>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { user } = request;
    if (!user || !user.id || !user.email) {
      throw new UserNotFoundException(user?.email || 'User');
    }

    const routePermissions: Permission[] = this.reflector.getAllAndOverride(
      'permissions',
      [context.getHandler(), context.getClass()],
    );
    if (!routePermissions) {
      return true;
    }

    const userRoles: Roles[] = await this.userRepository.fetchUserPermissions(
      user.id,
    );
    if (!userRoles) {
      throw new PermissionNotProvidedException(user.email);
    }

    const userPermissions = userRoles[0].permissions;

    for (const routePermission of routePermissions) {
      const userPermission = userPermissions.find(
        (perm) => perm.resource === routePermission.resource,
      );

      if (!userPermission) throw new PermissionNotProvidedException(user.email);

      const allActionsAvailable = routePermission.actions.every(
        (requiredAction) => userPermission.actions.includes(requiredAction),
      );
      if (!allActionsAvailable)
        throw new PermissionNotProvidedException(user.email);
    }
    return true;
  }
}
