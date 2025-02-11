import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './users.service';
import {
  sendCreatedResponse,
  sendSuccessReponse,
} from 'src/common/helpers/response.helper';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { RegisterValidationPipe } from 'src/pipes/registerValidation.pipe';
import { LoginValidationPipe } from 'src/pipes/loginValidation.pipe';
import { Request } from 'express';
import { Permissions } from 'src/decorators/permissions.decorators';
import { Resource } from '../roles/enums/resource.enum';
import { Action } from '../roles/enums/action.enum';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RedisService } from 'src/redis/redis.service';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
export default class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  @Post('register')
  @UsePipes(RegisterValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserData: CreateUserDto) {
    const userData = await this.userService.create(createUserData);
    return sendCreatedResponse(userData, 'User Created Successfully.');
  }

  @Post('login')
  @UsePipes(LoginValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async login(@Body() loginUser: LoginUserDto) {
    const token = await this.userService.login(loginUser);
    await this.redisService.set(`token:${loginUser.email}`, token);
    return sendSuccessReponse({ ...loginUser, token });
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth('AuthGuard')
  async profile(@Req() request: Request) {
    try {
      const user = request.user as { email: string; id: number };
      const { email } = user;
      return await this.userService.profile(email);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('assignRole/:roleName')
  @HttpCode(HttpStatus.OK)
  @Permissions([
    { resource: Resource.users, actions: [Action.create, Action.update] },
  ])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async assignRole(
    @Req() request: Request,
    @Param('roleName') roleName: string,
  ) {
    const user = request.user as { email: string; id: number };
    return await this.userService.assignRole(user.email, roleName);
  }
}
