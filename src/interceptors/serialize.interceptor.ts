import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
// import { UserDto } from 'src/users/dtos/user.dto';

interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: any) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run something before request is handled by request handler
        console.log("I'm running before the handler", context);

        return next.handle().pipe(
            map((data: any) => {
                // Run something before response is sent out
                console.log("Im running before response is sent out", data);
                // return plainToClass(UserDto, data, { //map data from response to UserDto
                //     excludeExtraneousValues: true
                // });
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                });
                //plainToClass: Converts plain object to class (constructor) object. Also works with arrays
            })
        )
    }
}