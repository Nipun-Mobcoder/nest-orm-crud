import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { CreateRoleDto } from './dto/roles.dto';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { Permissions } from 'src/decorators/permissions.decorators';
import { Resource } from './enums/resource.enum';
import { Action } from './enums/action.enum';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @Permissions([{ resource: Resource.settings, actions: [Action.create] }])
  async createRole(@Body() role: CreateRoleDto) {
    return this.rolesService.createRole(role);
  }

  @Patch('update')
  @HttpCode(HttpStatus.OK)
  @Permissions([{ resource: Resource.settings, actions: [Action.update] }])
  async updateRole(@Body() role: CreateRoleDto) {
    return this.rolesService.updateRole(role);
  }
}
