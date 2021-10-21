import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

import { Users } from '../models/Users';

import {
  UserLoginDto,
  UserCreateDto,
  UserUpdateDto,
} from '../validators/user.dto';
import {
  generateTokens,
  encryptPassword,
  getPagination,
  processOrderBy,
} from 'helpers';
import { Console } from 'console';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async index(queryParams: any) {
    const { originalPage, page, pageSize, calculatePageCount } =
      getPagination(queryParams);

    const builder = this.usersRepository
      .createQueryBuilder('u')
      .leftJoin('u.role', 'r')
      .select(['u', 'r']);

    const usersCount = await builder
      .skip(page)
      .take(pageSize)
      .getManyAndCount();

    const [users, total] = usersCount;

    return {
      items: users,
      page: originalPage,
      pageCount: calculatePageCount(total),
      itemsTotal: total,
    };
  }

  async me(id: number) {
    try {
      return this.usersRepository.findOne({
        where: { id },
        relations: ['role'],
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async show(id: number) {
    try {
      return this.usersRepository.findOne({
        where: { id },
        relations: ['role'],
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async login(body: UserLoginDto) {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('u')
        .leftJoin('u.role', 'r')
        .where(`u.email = :email`, {
          email: body.email,
        })
        .select(['u', 'r', 'u.password'])
        .getOne();

      if (!user) {
        throw new UnauthorizedException('Unauthorized, User not found');
      }

      const isValid = await bcrypt.compare(body.password, user.password);

      if (!isValid) {
        throw new UnauthorizedException('Unauthorized, password is invalid');
      }

      delete user.password;

      return {
        ...user,
        ...generateTokens({
          id: user.id,
          role_id: user.role_id,
        }),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(body: UserCreateDto) {
    try {
      return this.usersRepository.save({
        name: body.name,
        password: await encryptPassword(body.password),
        email: body.email,
        role_id: body.role_id,
        birthdate: body.birthdate,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(body: UserUpdateDto, id: number) {
    try {
      return this.usersRepository.save({
        id,
        name: body.name,
        password: await encryptPassword(body.password),
        email: body.email,
        role_id: body.role_id,
        birthdate: body.birthdate,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async destroy(id: number) {
    try {
      return this.usersRepository.softDelete({ id });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
