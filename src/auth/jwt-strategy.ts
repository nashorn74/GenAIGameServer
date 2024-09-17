import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../service/user/user.service';

interface JwtPayload {
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger: Logger;
  constructor(@Inject(forwardRef(() => UserService))
  private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_SECRET',
    });
    this.logger = new Logger(JwtStrategy.name);
  }

  async validate(payload: JwtPayload) {
    this.logger.log('Validate passport:', payload);
    return await this.userService.findOne({ email: payload.email });
  }
}
