import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from '../services/user.service';
import {
  UserLoginDto,
  UserCreateDto,
  UserUpdateDto,
  ParamsUserDto,
} from '../validators/user.dto';
@ApiTags('# Users')
@Controller('users') //Decorator recebe como parametro qual e a url
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async index(@Query() query, @Request() req) {
    return {
      message: 'Index',
      object: 'users',
      url: req.url,
      data: await this.usersService.index(query),
    };
  }

  @Get('me')
  async me(@Request() req) {
    const { tokenDecoded } = req;

    return {
      message: 'Me',
      object: 'users',
      url: req.url,
      data: await this.usersService.me(Number(tokenDecoded.id)),
    };
  }

  @Get(':id')
  async show(@Param() params: ParamsUserDto, @Request() req) {
    return {
      message: 'Show',
      object: 'users',
      url: req.url,
      data: await this.usersService.show(params.id),
    };
  }

  @Post('login')
  async login(@Body() body: UserLoginDto, @Request() req) {
    return {
      message: 'Login',
      object: 'users',
      url: req.url,
      data: await this.usersService.login(body),
    };
  }

  @Post('signup')
  async create(@Body() body: UserCreateDto, @Request() req) {
    return {
      message: 'Signup',
      object: 'users',
      url: req.url,
      data: await this.usersService.create(body),
    };
  }

  @Put(':id')
  async update(
    @Param() params: ParamsUserDto,
    @Body() body: UserUpdateDto,
    @Request() req,
  ) {
    return {
      message: 'Update User',
      object: 'users',
      url: req.url,
      data: await this.usersService.update(body, Number(params.id)),
    };
  }

  @Delete(':id')
  async delete(@Param() params: ParamsUserDto, @Request() req: any) {
    return {
      message: 'Delete User',
      object: 'users',
      url: req.url,
      data: await this.usersService.destroy(Number(params.id)),
    };
  }
}
