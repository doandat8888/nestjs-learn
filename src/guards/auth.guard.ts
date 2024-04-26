import { CanActivate, ExecutionContext } from "@nestjs/common";

//Guard is between request and route handler
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        //Check if user is signed in
        const request = context.switchToHttp().getRequest();
        return request.session.userId; 
    }
}