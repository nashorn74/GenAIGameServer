import {
	Controller,
	Post,
	Request,
	Logger,
} from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';

@Controller('user')
export class UserController {
	logger: Logger;
	constructor(private readonly userService: UserService) {
		this.logger = new Logger(UserController.name);
	}

	@Post('create')
	async create(@Request() req): Promise<any> {
		const newUser = req.body;
		try {
			const query = { email: newUser.email };
			const isUser = await this.userService.findOne(query);
			if (isUser) throw new ConflictException('User Already Exist');
			const user = await this.userService.create(newUser);
			return user;
		} catch (err) {
			this.logger.error('Somethin went wrong in signup:', err);
			throw err;
		}
	}
}
