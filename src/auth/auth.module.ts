import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';
import { AuthController } from '../controller/auth/auth.controller';
import { AuthService } from '../service/auth/auth.service';
import { LocalStrategy } from './local-strategy';
import { UserModule } from '../user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '3000s' },
    }),
    forwardRef(() => UserModule),
    PassportModule,
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule { }
