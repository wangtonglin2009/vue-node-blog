/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 * 
 */
let baseUrl = ''; 
// let baseUrl = 'http://localhost:3000/admin_demo_api/'; 
let baseImgPath;

// if (process.env.NODE_ENV == 'production') {
// 	baseUrl = 'https://yckzrlklzg.execute-api.us-east-2.amazonaws.com/dev';
//     baseImgPath = 'http://localhost:8002/img/';
// }else{
// 	baseUrl = 'https://yckzrlklzg.execute-api.us-east-2.amazonaws.com/dev';
//     baseImgPath = 'http://cangdu.org:8001/img/';
// }

export {
	baseUrl,
	baseImgPath
}