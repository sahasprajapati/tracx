import { ResponseMessage } from '@common/enums/response.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { generateRepsonseMessage } from './response';

export const verifyEntity = async <T>({
  model,
  id = 0,
  name = 'Model',
  throwExistError = false,
  findCondition,
}: {
  model: T;
  id?: number;
  name?: string;
  throwExistError?: boolean;
  findCondition?: any;
}) => {
  const criteria = {
    where: {
      ...(findCondition
        ? findCondition
        : {
            id: +id,
          }),
    },
  };
  const user = await (model as any).find(criteria);
  if (!user && !throwExistError)
    throw new NotFoundException(
      generateRepsonseMessage({
        model: name,
        message: ResponseMessage.NotFound,
      }),
    );

  if (user && user.length > 0 && throwExistError)
    throw new BadRequestException(
      generateRepsonseMessage({
        model: name,
        message: ResponseMessage.NotUnique,
      }),
    );

  return user;
};
