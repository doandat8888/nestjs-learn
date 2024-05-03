import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
//import { setupApp } from '../src/setup-app';

describe('Authentication System', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        // setupApp(app);
        // Use setupApp because when run E2E Test, it won't execute anything in a main.ts file, 
        // so we should move all from main.ts file to this setupApp and import it to app.module.ts
        // but it's not the best way to do it
        await app.init();
    });

    it('handles a sign up request', () => {
        const email = "tegr@gmail.com"
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({email, password: '123456'})
            .expect(201)
            .then((res) => {
                const { id, email } = res.body;
                expect(id).toBeDefined();
                expect(email).toEqual(email);
            })
    });

    it('sign up new user, then log the current user', async() => {
        const email = "teg@gmail.com"
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({email, password: '123456'})
            .expect(201);

        //Hanlde cookie
        const cookie = res.get('Set-Cookie');
        console.log("Cookie: ", cookie);
        const { body } = await request(app.getHttpServer())
            .get('/auth/user/current')
            .set('Cookie', cookie)
            .expect(200);

        expect(body.email).toEqual(email);
    });
});
