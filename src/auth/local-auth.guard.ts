import { Injectable, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  handleRequest(err: any, user: any, _info: any, _context: any, _status: any) {
    if (err || !user) {
      throw new HttpException(err.message, err.status);
    }
    return user;
  }
}
