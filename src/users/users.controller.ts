import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Res, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        let { email, password } = body;
        this.usersService.create(email, password);
    }

    @UseInterceptors(ClassSerializerInterceptor) //Use with decorator function from class-transformer or class-validator (Ex: @Exclude)
    @Get('/:id') 
    async findUserById(@Param('id') id: string) {
        let user = await this.usersService.findOne(parseInt(id));
        if(!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get()
    findUsersByEmail(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Patch('/:id')
    updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
        this.usersService.update(id, body);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        this.usersService.remove(parseInt(id));
    }
}
