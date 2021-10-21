import { BadRequestException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

interface ParamsGetTable {
  table: string;
  alias: string;
}

export const processOrderBy = (
  queryBuilder: SelectQueryBuilder<any>,
  tables: ParamsGetTable[],
  sort: string,
  order: 'ASC' | 'DESC' = 'ASC',
  isParamSortNameTable = false,
  isSqlOrderByNameTable = false,
) => {
  if (sort) {
    const [table, column] = sort.split('.');

    if (order !== 'ASC' && order !== 'DESC') {
      order = 'ASC';
    }

    const result = tables.find((val) => {
      if (isParamSortNameTable) {
        if (val.table === table) {
          return val;
        }
      } else {
        if (val.alias === table) {
          return val;
        }
      }
    });

    if (!result) {
      throw new BadRequestException(
        'Table passed in the sort parameter does not exist in the database!!',
      );
    }

    sort = isSqlOrderByNameTable
      ? result.table + '.' + column
      : result.alias + '.' + column;

    queryBuilder.orderBy(sort, order);
  }
};
