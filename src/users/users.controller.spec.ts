import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
    let controller: UsersController;
    let fakeUserService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>;

    beforeEach(async () => {
        fakeUserService = {
            findOne: (id: number) => {
                return Promise.resolve({
                    id,
                    email: 'abc@gmail.com',
                    password: '123456'
                } as User)
            },
            find: (email: string) => {
                return Promise.resolve([{
                    id: 1,
                    email,
                    password: '123456'
                } as User]);
            },
            // remove: () => {},
            // update: () => {}
        }
        fakeAuthService = {
            // signup: () => {},
            signin: (email: string, password: string) => {
                return Promise.resolve({ id: 1, email, password} as User)
            }
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUserService
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService
                }
            ]
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('findUsersByEmail return a list of users with the given email', async() => {
        const users = await controller.findUsersByEmail('abcd@gmail.com');
        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual('abcd@gmail.com');
    });

    it('findUser return a single user with the given id', async() => {
        const user = await controller.findUserById('1');
        expect(user).toBeDefined();
    });

    it('findUser throws an error if user with given id is not valid', async() => {
        fakeUserService.findOne = () => null
        await expect(controller.findUserById('123'),).rejects.toThrow(NotFoundException)
    });

    it('return a user when login successfully', async() => {
        const session = { userId: -10 }
        const user = await controller.login({email: 'def@gmail.com', password: '123456'}, session);
        console.log(user);
        expect(user.id).toEqual(1);
        expect(session.userId).toEqual(1);
    })
});
