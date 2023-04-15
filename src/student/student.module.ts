import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/user/entities/user.entity';
import { Student } from './entities/student.entity';
import { StudentsController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student])],
  controllers: [StudentsController],
  providers: [StudentService],
  exports: [StudentService, TypeOrmModule],
})
export class StudentsModule {}
