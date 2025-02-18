import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../../shared/models/entities/user/user';
import {Repository} from 'typeorm';
import {
	Request,
	Response
} from 'express';
import jwt from 'jsonwebtoken';
import {HEADER} from '../cors/headers';
import {VaultConfig} from '../../shared/models/classes/vault-config';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
			@InjectRepository(User)
			private readonly userRepository: Repository<User>,
	) {
	}
	
	async canActivate(
			context: ExecutionContext,
	): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest<Request>();
		const response: Response = context.switchToHttp().getResponse<Response>();
		const token: string = request.headers[HEADER.AUTHORIZATION] as string;
		try {
			const SECRET: string = VaultConfig.APP.JWT_SECRET;
			response.locals.jwtPayload = jwt.verify(token, SECRET);
			const userUuid: string = request.params?.id;
			const user: User = await this.userRepository.findOne({
				select: ['uuid'],
				where: {uuid: userUuid},
			});
			request.headers[HEADER.USER_UUID] = user.uuid;
			return true;
		} catch (error) {
			throw new ForbiddenException('Não foi possível autorizar a requisição.');
		}
	}
}
