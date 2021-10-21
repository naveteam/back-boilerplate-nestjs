import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '../models/Users';

import { UsersController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
