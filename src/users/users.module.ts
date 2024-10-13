import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt'; // JwtModule import
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from '../schemas/user.schema';
import { JwtStrategy } from '../auth/jwt.strategy';  // JWT 전략 (Optional)

@Module({
  imports: [
    // MongoDB의 'User' 컬렉션과 스키마를 연결
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: 'your_jwt_secret_key',  // 환경 변수로 secret 관리하는 것이 권장됨
      signOptions: { expiresIn: '1h' },  // JWT 토큰 만료시간 설정
    }),
  ],
  controllers: [UsersController], // UsersController 등록
  providers: [UsersService, JwtStrategy],  // JwtStrategy는 JWT 인증을 위한 전략 (Optional)
  exports: [UsersService],        // 다른 모듈에서 UsersService 사용 가능
})
export class UsersModule {}
