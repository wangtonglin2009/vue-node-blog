const path = require('path');
const bodyParser = require('koa-bodyparser');
const staticFiles = require('koa-static');
const Rule = require('./rule');
const Send = require('./send');
const Auth = require('./auth');
const Log = require('./log');
const Func = require('./func');

module.exports = app => {


    //跨域问题
    // app.use(async (ctx, next) => {
    //     ctx.set('Access-Control-Allow-Origin', 'http://node-blog.s3-website.us-east-2.amazonaws.com');
    //     ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET');
    //     ctx.set('Access-Control-Allow-Credentials', true);
    //     ctx.set('Access-Control-Max-Age', 3600 * 24);
    //     await next();
    //    });
// 我们可以用下面的中间件理解app.use(cors({}))

// app.use(async (ctx, next) => {
//     // 允许来自所有域名请求
//     // ctx.set("Access-Control-Allow-Origin", "http://node-blog.s3-website.us-east-2.amazonaws.com");
//     ctx.set("Access-Control-Allow-Origin", "http://localhost:8090");
//     // 这样就能只允许 http://localhost:8080 这个域名的请求了
//     // ctx.set("Access-Control-Allow-Origin", "http://localhost:8080"); 

//     // 设置所允许的HTTP请求方法
//     ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

//     // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
//     ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");

//     // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。

//     // Content-Type表示具体请求中的媒体类型信息
//     ctx.set("Content-Type", "application/json;charset=utf-8");

//     // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
//     // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
//     ctx.set("Access-Control-Allow-Credentials", true);

//     // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
//     // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
//     // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
//     ctx.set("Access-Control-Max-Age", 300);

//     /*
//     CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
//         Cache-Control、
//         Content-Language、
//         Content-Type、
//         Expires、
//         Last-Modified、
//         Pragma。
//     */
//     // 需要获取其他字段时，使用Access-Control-Expose-Headers，
//     // getResponseHeader('myData')可以返回我们所需的值
//     ctx.set("Access-Control-Expose-Headers", "myData");

//     await next();
// })

    //缓存拦截器
    app.use(async (ctx, next) => { 
        if (ctx.url == '/favicon.ico') return

        await next()
        ctx.status = 200
        ctx.set('Cache-Control', 'must-revalidation')
        if (ctx.fresh) {
            ctx.status = 304
            return
        }
    })

    // 日志中间件
    app.use(Log())

    // 数据返回的封装
    app.use(Send())

    // 方法封装
    app.use(Func())

    //权限中间件
    app.use(Auth())

    //post请求中间件
    app.use(bodyParser())
    
    //静态文件中间件
    app.use(staticFiles(path.resolve(__dirname, '../../../public')));

    // 规则中间件
    Rule({
        app,
        rules: [
            {
                path: path.join(__dirname, '../controller/admin'),
                name: 'admin'
            },
            {
                path: path.join(__dirname, '../controller/client'),
                name: 'client'
            }
        ]
    })

    // 增加错误的监听处理
    app.on("error", (err, ctx) => {
        if (ctx && !ctx.headerSent && ctx.status < 500) {
            ctx.status = 500
        }
        if (ctx && ctx.log && ctx.log.error) {
            if (!ctx.state.logged) {
                ctx.log.error(err.stack)
            }
        }
    })

}