import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../../src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../../src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto) //Serialize middleware, apply it to all request
// @UseInterceptors(CurrentUserInterceptor)

export class UsersController {
    constructor(
        private usersService: UsersService, 
        private authService: AuthService
    ) {}

    // @Get('/user/current')
    // getCurrentUser(@Session() session: any) {
    //     return this.usersService.findOne(session.userId); // Note: findOne(null) will return the first record
    // }

    @UseGuards(AuthGuard) //If user is not signed in, throw an error, else execute logic in route handler
    @Get('/user/current')
    getCurrentUser(@CurrentUser() currentUser: User) {
        return currentUser;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    // Test Session
    @Get('/colors/:color')
    setColor(@Param() color: string, @Session() session: any) {
        session.color = color;
    }

    @Get('/colors')
    getColor(@Session() session: any) {
        return session.color;
    }

    // Real session
    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        let { email, password } = body;
        const user = await this.authService.signup(email, password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async login(@Body() body: CreateUserDto, @Session() session: any) {
        let { email, password } = body;
        const user = await this.authService.signin(email, password);
        session.userId = user.id;
        return user;
    }

    // @UseInterceptors(ClassSerializerInterceptor) //Use with decorator function from class-transformer or class-validator (Ex: @Exclude)
    // @UseInterceptors(new SerializeInterceptor(UserDto)) // @UseInterceptor means use middleware
    // @Serialize(UserDto) //Serialize middleware
    @Get('/:id') 
    async findUserById(@Param('id') id: string) {
        console.log('Handler is running...')
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
