import { Context } from "koa";

const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

app.use(async (ctx: Context, next: () => unknown) => {
    ctx.body = 'Hello World';
    next();
});

// 连接数据库
const mongoose = require('mongoose');
const { dbUrl } = require('../config/config.ts');
mongoose.connect(dbUrl)
    .then(() => { console.log('Mongodb Connected..'); })
    .catch((err: Error) => { console.log(err); })

// 引入websocket模块 
const websockify = require('koa-websocket');
const ws_app = websockify(app);
ws_app.ws.use((ctx: Context, next: Function) => {
    ctx.websocket.send('连接成功');
    return next(ctx);
})
ws_app.ws.use(router.all('/', (ctx: Context) => {
    ctx.websocket.send('Hello World');
    ctx.websocket.on('message', function (message: any) {
        console.log(message);
        ctx.websocket.end('666');
    });
}));
// websocket.ws.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
ws_app.listen(PORT, () => {
    console.log('server started on port 3000');
});