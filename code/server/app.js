const serverless = require('serverless-http'); 
const Koa = require('koa');
const ip = require('ip');
const conf = require('./config');
const router = require('./router');
const middleware = require('./middleware');
// const './mongodb'

const app = new Koa();
middleware(app)
router(app)
app.listen(conf.port, '0.0.0.0', () => {
    console.log(`server is running at http://${ip.address()}:${conf.port}`)
})

module.exports.handler = serverless(app);