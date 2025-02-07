import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ example: 'Nipun Bhardwaj' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'nipun@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    example: '123456789',
    description:
      'This is the password for the login and should be more then or equal to 8 characters.',
  })
  password: string;
}
