import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  isNumberString,
  IsNumberString,
  IsString,
} from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  role_id: number;

  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  birthdate: string;
}

export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  role_id: number;

  @IsNotEmpty()
  @IsDateString({ strict: true } as any)
  birthdate: string;
}

export class ParamsUserDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number;
}
