// src/users/users.controller.ts
import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 회원가입
  @Post('auth/register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.register(createUserDto);
    return { message: '회원가입이 완료되었습니다.', user };
  }

  // 로그인
  @Post('auth/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { user, token } = await this.usersService.login(loginUserDto);
    return { message: '로그인 성공', token };
  }

  // 로그아웃
  @Post('auth/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req) {
    const userId = req.user.id;
    const result = await this.usersService.logout(userId);
    return result;
  }

  // 특정 사용자 정보 조회
  @Get('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    return user;
  }

  // 전체 사용자 목록 조회
  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }

  // 사용자 정보 수정
  @Put('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    return { message: '사용자 정보가 수정되었습니다.', updatedUser };
  }

  // 사용자 삭제
  @Delete('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Param('id') id: string) {
    const result = await this.usersService.deleteUser(id);
    return result;
  }
}
