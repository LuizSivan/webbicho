import {
	Body,
	Headers,
	HttpException,
	InternalServerErrorException,
	UseGuards
} from '@nestjs/common';
import {WbEntity} from '../shared/models/entities/wb-entity';
import {Page} from '../shared/models/classes/page';
import {WbService} from './wb.service';
import {
	DeepPartial,
	FindOptionsOrder
} from 'typeorm';
import {WhereParam} from '../shared/models/types/where-param';
import {CheckJwtGuard} from '../core/guards/check-jwt.guard';
import {HEADER} from '../core/cors/headers';


@UseGuards(CheckJwtGuard)
export abstract class WbController<
	T extends WbEntity,
	S extends WbService<T, CT, UT>,
	CT,
	UT,
> {
	protected constructor(
			private readonly service: S,
	) {
	}
	
	public async findOne(
			id?: string,
			fields?: string[],
			relations?: string[],
			params?: WhereParam<T>[],
	): Promise<T> {
		try {
			return this.service.findOne(id, fields, relations, params);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao buscar ${this.service.entityName} ${id}: ${e.message}`,
			);
		}
	}
	
	public async list(
			page: number,
			size: number,
			fields?: string[],
			relations?: string[],
			params?: WhereParam<T>[],
			order?: FindOptionsOrder<T>,
	): Promise<Page<T>> {
		try {
			return this.service.list(page, size, fields, relations, params, order);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao buscar lista de ${this.service.entityName}: ${e.message}`,
			);
		}
	}
	
	public async create(
			entity: CT,
			userUuid: string,
	): Promise<T> {
		try {
			return this.service.create(entity, userUuid);
		} catch (e: any) {
			throw new InternalServerErrorException(
					`Erro ao criar ${this.service.entityName}: ${e.message}`,
			);
		}
	}
	
	public async update(
			id: string,
			userUuid: string,
			entity: UT,
	): Promise<T> {
		try {
			return this.service.update(id, entity, userUuid);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao atualizar ${this.service.entityName}: ${e.message}`,
			);
		}
	}
	
	
	public async bulkUpdate(
			@Body() entity: DeepPartial<T>,
			@Headers(HEADER.USER_UUID) userUuid: string,
			@Headers(HEADER.PARAMS) params: WhereParam<T>[],
	): Promise<void> {
		try {
			await this.service.bulkUpdate(entity, userUuid, params);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao atualizar ${this.service.entityName}: ${e.message}`,
			);
		}
	}
	
	
	public async delete(
			id: string,
			userUuid: string,
	): Promise<void> {
		try {
			await this.service.delete(id, userUuid);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao deletar ${this.service.entityName}: ${e.message}`,
			);
		}
	}
	
	
	public async bulkDelete(
			@Headers(HEADER.USER_UUID) userUuid: string,
			@Headers(HEADER.PARAMS) params: WhereParam<T>[],
	): Promise<void> {
		try {
			await this.service.bulkDelete(params, userUuid);
		} catch (e: any) {
			if (e instanceof HttpException) throw e;
			throw new InternalServerErrorException(
					`Erro ao deletar ${this.service.entityName}: ${e.message}`,
			);
		}
	}
}
