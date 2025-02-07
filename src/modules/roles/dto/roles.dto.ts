import { Type } from 'class-transformer';
import { ArrayUnique, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Action } from '../enums/action.enum';
import { Resource } from '../enums/resource.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsString()
  @ApiProperty({
    description: 'This is the name of the role and it should be unique.',
    example: 'Admin',
  })
  name: string;

  @ValidateNested({ each: true })
  @Type(() => Permission)
  @ApiProperty({
    description: 'This is an array which should provide the Permissions.',
    example: [{ resource: 'settings', actions: ['update', 'create'] }],
  })
  permissions: Permission[];
}

export class Permission {
  @IsEnum(Resource)
  resource: Resource;

  @IsEnum(Action, { each: true })
  @ArrayUnique()
  actions: Action[];
}
