import { instanceToPlain } from 'class-transformer';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { AbstractOrmEntity } from '@libs/server/util-common';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_ORDER,
  PAGINATION_DEFAULT_PER_PAGE,
} from '@libs/shared/util-constants';
import { Logger } from '@nestjs/common';

import {
  PaginationMetaDto,
  PaginationOptionsDto,
  PaginationResponseDto,
} from '../dtos';

export class PaginationService<OrmEntity extends AbstractOrmEntity> {
  private readonly _logger: Logger;
  private repo: Repository<OrmEntity>;
  constructor(entity: OrmEntity, repo: Repository<OrmEntity>) {
    this._logger = new Logger(`${entity.constructor.name} Pagination`);
    this.repo = repo;
  }

  private get alias(): string {
    return this.repo.metadata.tableName;
  }

  /**
   * Single entry point for creating a payload with paginated data. Allows for an
   * optional serialization function if custom logic is needed to convert an ORM
   * entity.
   *
   * @param opts
   * @param serializeFn
   * @returns
   */
  async paginate<SerializedEntityType>(
    opts?: PaginationOptionsDto,
    serializeFn?: (entity: OrmEntity) => SerializedEntityType,
  ): Promise<PaginationResponseDto<SerializedEntityType>> {
    this._logger.debug(
      `Paginating response for entities in table ${this.alias}`,
    );
    const qb = this.createBuilder(opts);

    const [items, total] = await qb.getManyAndCount();
    const limit = qb.expressionMap.take;
    const offset = qb.expressionMap.skip;

    const meta = this.createPaginationMeta(total, limit ?? total, offset ?? 0);
    const data = serializeFn
      ? items.map(serializeFn)
      : items.map((i) => instanceToPlain(i) as SerializedEntityType);

    return new PaginationResponseDto(data, meta);
  }

  /**
   * Creates a QueryBuilder instance configured with pagination options such as page,
   * perPage, order, and skip
   * @param builder
   */
  private createBuilder(
    opts?: PaginationOptionsDto,
  ): SelectQueryBuilder<OrmEntity> {
    const builder = this.repo.createQueryBuilder(this.alias);
    this._logger.debug(
      `Creating pagination builder with opts:\n${JSON.stringify(
        opts,
        null,
        2,
      )}`,
    );

    // NOTE this code currently defaults to using pre-defined pagination defaults,
    // but this could be updated to not return paginated data if `page` or `limit`
    // are not defined
    if (opts) {
      // TODO add ability to sort by arbitrary columns instead of createdAt
      const sortBy = `${this.alias}.createdAt`;
      builder.orderBy(sortBy, opts.order ?? PAGINATION_DEFAULT_ORDER);

      const take = this.calculateTake(opts.limit, opts.perPage);
      if (take) {
        builder.take(take);
      }

      const skip = this.calculateSkip(opts.page, take);
      if (skip) {
        builder.skip(skip);
      }
    }

    return builder;
  }

  private createPaginationMeta(
    total: number,
    limit: number,
    offset: number,
  ): PaginationMetaDto {
    const totalPages = limit && total ? Math.ceil(total / limit) : 1;
    const page = totalPages > 1 && limit ? Math.floor(offset / limit) + 1 : 1;
    return new PaginationMetaDto({
      page,
      totalPages,
      totalItems: total,
      perPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  }

  private calculateTake(limit?: number, perPage?: number): number | null {
    let take = null;

    if (limit && perPage) {
      take = Math.min(limit, perPage);
    } else if (perPage && perPage <= PAGINATION_DEFAULT_PER_PAGE) {
      take = perPage;
    } else if (limit && limit <= PAGINATION_DEFAULT_LIMIT) {
      take = limit;
    } else if (!limit && !perPage) {
      // neither defined
      take = Math.min(PAGINATION_DEFAULT_LIMIT, PAGINATION_DEFAULT_PER_PAGE);
    }
    return take;
  }

  private calculateSkip(page?: number, take?: number | null): number | null {
    return page && take ? take * (page - 1) : null;
  }
}
