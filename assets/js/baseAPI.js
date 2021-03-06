// 每天调用服务器请求的时候，会先调用这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options.url);

    // 统一为有权限的接口，设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        // if (options.url.includes('/my/')) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        };
    }
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空 token
            localStorage.removeItem('token');
            // 2. 强制跳转到登录页面
            location.href = './login.html';
        }
    };
});
