import { PageMetaDto } from '../dtos/pagination/page-meta.dto';
import { PageOptionsDto } from '../dtos/pagination/page-options.dto';
import { PageDto } from '../dtos/pagination/page.dto';

type PaginateCriteria = {
  where: any;
  skip: number;
  take: number;
  orderBy: any;
  include?: any;
  exclude?: string[];
};

// Exclude keys from model
export function exclude<Model, Key extends keyof Model>(
  model: Model,
  keys: Key[],
): Omit<Model, Key> {
  for (let key of keys) {
    delete model[key];
  }
  return model;
}

export const paginate = async <Model, FindParams>(
  model: any,
  criteria: FindParams,
  pageOptionsDto: PageOptionsDto,
  modelName: string,
) => {
  // CRUD operations
  const entities = await (model as any).find(criteria);
  delete criteria['select'];
  delete criteria['include'];
  delete criteria['take'];
  delete criteria['skip'];

  // const itemCount = await (model as any)
  //   .createQueryBuilder(modelName)
  //   .addSelect('COUNT(*)', 'count')
  //   .getRawOne();
  const pageMetaDto = new PageMetaDto({ itemCount: 0, pageOptionsDto });

  return new PageDto<Model>(entities, pageMetaDto);
};

export const paginateFilter = (
  filter: string,
): { contains?: string; mode?: 'insensitive' } => {
  return filter ? { contains: filter, mode: 'insensitive' } : {};
};
export const paginateSearch = (filter: string): { search?: string } => {
  return filter ? { search: filter.split(' ').join(' | ') } : {};
};
