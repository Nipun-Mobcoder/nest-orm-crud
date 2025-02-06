import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/roles.dto';
import { Roles } from './entities/roles.entities';
import { RolesRepository } from './roles.repositories';
import { RolesAlreadyExistsException } from 'src/common/exceptions/RoleAlreadyExistsException';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async createRole(createRole: CreateRoleDto): Promise<Roles> {
    const isPresent = await this.rolesRepository.findRole(createRole.name);
    if (isPresent) throw new RolesAlreadyExistsException(createRole.name);

    return this.rolesRepository.create(createRole);
  }

  async updateRole(createRole: CreateRoleDto): Promise<Roles> {
    return this.rolesRepository.create(createRole);
  }
}
