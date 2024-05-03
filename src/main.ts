import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { setupApp } from './setup-app';
// import { ValidationPipe } from '@nestjs/common';
// const cookieSession = require('cookie-session');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //setupApp(app);
    // app.use(
    //     cookieSession({
    //         keys: ['BWUiLhXKyEQkddoegYMrN']
    //     })
    // )
    // app.useGlobalPipes(
    //     new ValidationPipe({
    //         whitelist: true //Make sure that there is no extra property in request
    //     })
    // )
    await app.listen(3000);
}
bootstrap();
