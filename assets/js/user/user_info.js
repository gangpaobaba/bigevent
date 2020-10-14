$(function () {
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！';
            }
        },
    });
    initUserInfo();

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                console.log(res);
                form.val('formUserInfo', res.data);
            },
        });
    }
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    });

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('更新信息失败');
                }
                layer.msg('更新信息成功');
                // 调用父页面的方法，重新渲染头像和信息
                window.parent.getUserInfo();
            },
        });
    });
});
