import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer'], function () {
    // var $ = layui.jquery
    $(".password-logo").click(function () {

        if ($("#pwd").attr("type") == "password") {
            $("#pwd").attr('type', 'text');
            $("#password-logo").css('top', '-11px');
        } else {
            $("#pwd").attr('type', 'password');
            $("#password-logo").css('top', '3px');
        }
    });


    $('#username').blur(function () {
        var myreg = /[\u4e00-\u9fa5]/;
        if (!myreg.test($('#username').val())) {
            $('.username').css('display', 'none');
            return false;
        } else {
            $('.username').html('请输入正确的用户名');
            $('.username').css('display', 'block');
            return true;
        }
    })

    //键盘事件
    document.onkeyup = function (event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        switch (keyCode) {
            case 13:
                $("#btn-login").click();
                break;
            default:
                break;
        }
    }


    $('#btn-login').click(function () {
        if ($('#username').val() === '') {
            $('.username').html('用户名不能为空');
            $('.username').css('display', 'block');
            return false
        } else if ($('#pwd').val() === '') {
            $('.password').html('密码不能为空');
            $('.password').css('display', 'block');
        } else {
            $('.password').css('display', 'none');

            $.ajax({
                url: baseUrl + '/sys/login',
                type: 'POST',
                dataType: 'json',
                data: {
                    userCode: $('#username').val(),
                    password: $('#pwd').val()
                },
                success: function (data) {
                    if (data.code === 200) {
                        localStorage.setItem('loginInfo', JSON.stringify(data.rows));
                        window.open('../homePage.html', '_self')
                    } else {
                        layer.alert(data.msg, {
                            title: '提示',
                            icon: 5,
                            anim: 6
                        })
                    }
                },
                error: function (err) {
                    layer.msg('接口错误');
                }
            })
        }
    })
})