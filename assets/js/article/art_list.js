$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来氢气数据的时候，需要将请求对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 默认每页显示几条数据
        cate_id: '', // 文章分来的 Id
        state: '', // 文章的发布状态
    };
    initTable();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                console.log('获取文章列表成功');
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                // console.log(res);
                $('tbody').html(htmlStr);
                // 调用渲染页面的方法
                renderPage(res.total);
            },
        });
    }
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    initCate();

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            },
        });
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象 q 对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        console.log(total);
        // 调用laypage.render方法
        laypage.render({
            elem: 'pageBox', // 分页容器ID
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示条数
            curr: q.pagenum, // 默认选中的分页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 可以通过first的值，判断哪种方式触发，true就是调用函数触发
            // false就是点击页码触发
            jump: function (obj, first) {
                console.log(obj.curr);
                // 把最新的页码值赋值给 q
                q.pagenum = obj.curr;
                // 把最新得条目数赋值给pagesize
                q.pagesize = obj.limit;
                // 根据最新的q 获取对应数据
                // initTable();
                console.log('first:', first);
                if (!first) {
                    initTable();
                }
            },
        });
    }

    // 通过代理形式，给删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        // 给模板在遍历生成DOM的时候，添加对应的id属性
        // 通过对应的id去删除数据
        var id = $(this).attr('data-id');
        var len = $('.btn-delete').length;
        layer.confirm('确定删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    // 判断当前按钮等于1时，如果点击删除，页码减一，点击取消，不往下执行
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    // 删除成功后，重新渲染数据
                    initTable();
                },
            });
            layer.close(index);
        });
    });
});
