import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        // const { session } = request;
        // const { userId } = session;
        // return userId;
        return request.currentUser; //handled by current-user.interceptor.ts
    }
)