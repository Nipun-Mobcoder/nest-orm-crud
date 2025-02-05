import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginUserDto } from 'src/modules/users/dto/login-user.dto';

@Injectable()
export class LoginValidationPipe implements PipeTransform {
  async transform(value: any) {
    const loginDto = plainToInstance(LoginUserDto, value);
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat()
        .join(', ');
      throw new BadRequestException(`Validation failed: ${errorMessages}`);
    }
    return value;
  }
}
