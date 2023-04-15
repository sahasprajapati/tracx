import { ResponseDto } from '@common/dtos/response.dto';
import { ResponseMessage } from '@common/enums/response.enum';
import { generateRepsonseMessage } from '@common/utils/response';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '@src/auth/decorator/public.decorator';
import { PageOptionsDto } from '@src/common/dtos/pagination/page-options.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';

@Controller('students')
@UseInterceptors(ClassSerializerInterceptor)
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createUserDto: CreateStudentDto, @Request() req) {
    return new ResponseDto(
      generateRepsonseMessage({
        model: 'Student',
        message: ResponseMessage.Create,
      }),
      await this.studentService.create(createUserDto, req.user),
    );
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.studentService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new ResponseDto(
      generateRepsonseMessage({
        model: 'User',
        message: ResponseMessage.Read,
      }),
      await this.studentService.findOne(+id),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateStudentDto,
    @Request() req
  ) {
    return new ResponseDto(
      generateRepsonseMessage({
        model: 'User',
        message: ResponseMessage.Update,
      }),
      await this.studentService.update(+id, updateUserDto, req.user),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new ResponseDto(
      generateRepsonseMessage({
        model: 'User',
        message: ResponseMessage.Delete,
      }),
      await this.studentService.remove(+id),
    );
  }

  // @Put('/delete')
  // async removeMulti(@Body('ids') ids: number[]) {
  //   return new ResponseDto(
  //     generateRepsonseMessage({
  //       model: 'User',
  //       message: ResponseMessage.Delete,
  //     }),
  //     await this.studentService.removeMulti(ids),
  //   );
  // }
}
