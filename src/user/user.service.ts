import { verifyEntity } from '@common/utils/verifyEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from '@src/common/dtos/pagination/page-options.dto';
import { PageDto } from '@src/common/dtos/pagination/page.dto';
import { paginate } from '@src/common/utils/paginate';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await verifyEntity({
      model: this.userRepo,
      name: 'User email',
      findCondition: {
        email: createUserDto.email,
      },
      throwExistError: true,
    });
    const user: User = new User();

    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.email = createUserDto.email;

    return this.userRepo.save(user);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    options?: {
      role: 'student' | 'instructor' | 'super';
    },
  ): Promise<PageDto<any>> {
    // Get proper criteria using prisma findMany types
    // this.userRepo.findMany();

    const criteria = {
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      order: {
        createdAt: pageOptionsDto.order,
      },
    };
    const users = await paginate<any, any>(
      this.userRepo,
      criteria,
      pageOptionsDto,
      'User',
    );
    this.userRepo.find();
    return users;
  }

  async findOne(id: number) {
    await verifyEntity({
      model: this.userRepo,
      name: 'User',
      id,
    });
    return this.userRepo.findOne({
      where: {
        id: +id,
      },
    });
  }

  findOneByEmail(email: string) {
    return this.userRepo.findOne({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await verifyEntity({
      model: this.userRepo,
      name: 'User',
      id,
    });
    return this.userRepo.update({ id }, updateUserDto);
  }

  async remove(id: number) {
    await verifyEntity({
      model: this.userRepo,
      name: 'User',
      id,
    });
    return this.userRepo.delete({ id });
  }
}
