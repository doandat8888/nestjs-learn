import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run something before request is handled by request handler
        console.log("I'm running before the handler", context);

        return next.handle().pipe(
            map((data: any) => {
                // Run something before response is sent out
                console.log("Im running before response is sent out", data);
            })
        )
    }
    
}