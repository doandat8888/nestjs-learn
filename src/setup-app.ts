import { ValidationPipe } from "@nestjs/common"
const cookieSession = require('cookie-session');

export const setupApp = (app: any) => {
    app.use(
        cookieSession({
            keys: ['BWUiLhXKyEQkddoegYMrN']
        })
    )
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true //Make sure that there is no extra property in request
        })
    )
}