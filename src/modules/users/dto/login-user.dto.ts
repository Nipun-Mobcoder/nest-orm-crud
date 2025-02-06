import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "nipun@gmail.com" })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "123456789", description: "This is the password for the login and should be more then 8 characters." })
  password: string;
}
