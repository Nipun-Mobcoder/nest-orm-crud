import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CreateRoleDto } from './dto/roles.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async createRole(@Body() role: CreateRoleDto) {
    return this.rolesService.createRole(role);
  }
}
