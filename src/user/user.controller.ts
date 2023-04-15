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
  Post, Query,
  UseInterceptors
} from '@nestjs/common';
import { Public } from '@src/auth/decorator/public.decorator';
import { PageOptionsDto } from '@src/common/dtos/pagination/page-options.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './user.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return new ResponseDto(
      generateRepsonseMessage({
        model: 'User',
        message: ResponseMessage.Create,
      }),
      await this.usersService.create(createUserDto),
    );
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.findAll(pageOptionsDto);
  }

  @Public()
  @Get('instructor')
  async findAllInstructor(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.findAll(pageOptionsDto, {
      role: 'instructor',
    });
  }

  @Public()
  @Get('student')
  async findAllStudent(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.findAll(pageOptionsDto, {
      role: 'student',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new ResponseDto(
      generateRepsonseMessage({
        model: 'User',
        message: ResponseMessage.Read,
      }),
      await this.usersService.findOne(+id),
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return new ResponseDto(
      generateRepsonseMessage({
        model: 'User',
        message: ResponseMessage.Update,
      }),
      await this.usersService.update(+id, updateUserDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new ResponseDto(
      generateRepsonseMessage({
        model: 'User',
        message: ResponseMessage.Delete,
      }),
      await this.usersService.remove(+id),
    );
  }

  // @Put('/delete')
  // async removeMulti(@Body('ids') ids: number[]) {
  //   return new ResponseDto(
  //     generateRepsonseMessage({
  //       model: 'User',
  //       message: ResponseMessage.Delete,
  //     }),
  //     await this.usersService.removeMulti(ids),
  //   );
  // }
}
