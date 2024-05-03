import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { ReportsController } from './reports/reports.controller';
import { UsersService } from './users/users.service';
import { ReportsService } from './reports/reports.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { AuthService } from './users/auth.service';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    type: 'sqlite',
                    database: config.get<string>('DB_NAME'),
                    synchronize: true,
                    entities: [User, Report]
                }
            }
        }),
        TypeOrmModule.forFeature([User, Report]),
        UsersModule, 
        ReportsModule
    ],
    controllers: [AppController, UsersController, ReportsController],
    providers: [
        AppService, 
        UsersService, 
        ReportsService, 
        AuthService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true //Make sure that there is no extra property in request
            })
        }
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(
            cookieSession({
                keys: ['BWUiLhXKyEQkddoegYMrN']
            })
        ).forRoutes('*'); 
        //Set as global scope middleware from main.ts file, so when we run E2E Test, it will not throw an error
    }
}
