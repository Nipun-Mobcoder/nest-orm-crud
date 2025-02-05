import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from 'src/modules/users/dto/createUser.dto';

@Injectable()
export class RegisterValidationPipe implements PipeTransform {
  async transform(value: any) {
    const userDto = plainToInstance(CreateUserDto, value);
    const errors = await validate(userDto);

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
