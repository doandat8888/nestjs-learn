import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {

    let service: AuthService;
    let fakeUserService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];
        //Create a fake copy of user service
        fakeUserService = {
            find: (email: string) => {
                const usersFiltered = users.filter((user) => user.email === email);
                return Promise.resolve(usersFiltered);
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 99999),
                    email,
                    password
                } as User;

                users.push(user);
                return Promise.resolve(user);
            }
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUserService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    })

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('should create a new user with a salted and hashed password', async () => {
        const FIXED_PASSWORD = '123456';
        const user = await service.signup('rtg@gmail.com', FIXED_PASSWORD);
        expect(user.password).not.toEqual(FIXED_PASSWORD);
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        // fakeUserService.find = () => 
        //     Promise.resolve([
        //         { id: 1, email: 'a', password: '1' } as User
        //     ]);
        await service.signup('abc@gmail.com', '123456');
        await expect(service.signup('abc@gmail.com', '123456')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('throws if an invalid password is provided', async () => {
        // fakeUserService.find = () =>
        //     Promise.resolve([
        //         { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
        //     ]);
        await service.signup('asdf@asdf.com', 'laskdjf');
        await expect(service.signin('asdf@asdf.com', 'passowrd'),).rejects.toThrow(
            BadRequestException
        );
    });

    it('returns a user if password is valid', async () => {
        // To test this case, first we need to sign up to get the hashed password, then paste hashed password to Promise.resolve(...)
        // const user = await service.signup('lyz@gmail.com', '123456');
        // console.log(user);
        fakeUserService.find = () =>
            Promise.resolve([
                { 
                    email: 'asdf@asdf.com', 
                    password: 'cf73c92c40a492b1.fd986b4bdcea14ec949d8b3e9a117070f7c402ceaa8624fd5c899164574589ae' 
                } as User,
            ])
        const user = await service.signin('lyz@gmail.com', '123456');
        expect(user).toBeDefined();
    })
});

