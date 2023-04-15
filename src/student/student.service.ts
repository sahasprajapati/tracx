import { verifyEntity } from '@common/utils/verifyEntity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from '@src/common/dtos/pagination/page-options.dto';
import { PageDto } from '@src/common/dtos/pagination/page.dto';
import { paginate } from '@src/common/utils/paginate';
import { User } from '@src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto, user: User) {
    const student: Student = new Student();

    student.name = createStudentDto.name;
    student.address = createStudentDto.address;
    student.phone = createStudentDto.phone;
    student.dob = createStudentDto.dob;
    student.about = createStudentDto.about;
    student.user = user;

    return this.studentRepo.save(student);
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    options?: {},
  ): Promise<PageDto<any>> {
    // Get proper criteria using prisma findMany types
    // this.studentRepo.findMany();

    const criteria: any = {
      skip: +pageOptionsDto.skip ?? 0,
      order: {
        createdAt: pageOptionsDto.order,
      },
      relations: {
        user: true,
      },
    };
    if (pageOptionsDto.take) {
      criteria.take = pageOptionsDto.take;
    }
    const students = await paginate<any, any>(
      this.studentRepo,
      criteria,
      pageOptionsDto,
      'Student',
    );
    return students;
  }

  async findOne(id: number) {
    await verifyEntity({
      model: this.studentRepo,
      name: 'Student',
      id,
    });
    return this.studentRepo.findOne({
      where: {
        id: +id,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto, user: User) {
    await verifyEntity({
      model: this.studentRepo,
      name: 'Student',
      id,
    });
    return this.studentRepo.update({ id }, updateStudentDto);
  }

  async remove(id: number) {
    await verifyEntity({
      model: this.studentRepo,
      name: 'Student',
      id,
    });
    return this.studentRepo.delete({ id });
  }
}
