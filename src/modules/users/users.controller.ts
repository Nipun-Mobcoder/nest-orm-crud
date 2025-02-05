import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RegisterValidationPipe } from 'src/pipes/registerValidation.pipe';
import { LoginValidationPipe } from 'src/pipes/loginValidation.pipe';

@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

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
  async login(@Body() loginUser: LoginUserDto) {
    const token = await this.userService.login(loginUser);
    return sendSuccessReponse({ ...loginUser, token });
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async profile(@Req() request) {
    const { email } = request.user;
    const data = await this.userService.profile(email);
    return sendSuccessReponse(data);
  }
}
