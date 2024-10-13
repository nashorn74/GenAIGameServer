// src/users/users.service.ts
import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        private readonly jwtService: JwtService,
      ) {}

  // 회원가입: 새로운 사용자 생성
  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  // 로그인: 사용자 인증 및 JWT 발급
  async login(loginUserDto: LoginUserDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('잘못된 이메일 또는 비밀번호입니다.');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedException('잘못된 이메일 또는 비밀번호입니다.');
    }
    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }

  // 로그아웃: 클라이언트 측에서 토큰을 삭제하도록 처리 (서버 측에서는 토큰 블랙리스트 등 필요할 수 있음)
  async logout(userId: string): Promise<{ message: string }> {
    // 예시: 토큰 블랙리스트에 추가하는 로직이 필요할 수 있음
    return { message: '로그아웃 되었습니다.' };
  }

  // 특정 사용자 정보 조회
  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password'); // 비밀번호 제외
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  // 모든 사용자 목록 조회
  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password');
  }

  // 사용자 정보 수정
  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      // 비밀번호가 업데이트될 경우 해싱을 위해 해당 필드를 수정 상태로 설정
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      user.password = updateUserDto.password;
      // 다른 필드 업데이트
      Object.assign(user, updateUserDto);
      return user.save();
    } else {
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).select('-password');
      if (!updatedUser) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      return updatedUser;
    }
  }

  // 사용자 삭제
  async deleteUser(userId: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(userId);
    if (!result) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return { message: '사용자가 성공적으로 삭제되었습니다.' };
  }
}
