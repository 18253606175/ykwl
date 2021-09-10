import { baseUrl } from "./params.js";

layui.use(['element','form'], function () {
    var $ = layui.jquery;
    var element = layui.element;
    var form = layui.form;

    $('.layui-nav-img').attr('src', localStorage.getItem('loginInfo') ? JSON.parse(localStorage.getItem('loginInfo')).imgUrl ? JSON.parse(localStorage.getItem('loginInfo')).imgUrl : '../img/esco_logo.png' : '../img/esco_logo.png')


    //循环侧边导航栏
    var nav = localStorage.getItem('loginInfo') ? JSON.parse(localStorage.getItem('loginInfo')).roleCode.menuVOS : []
    $('.layui-nav-bar').remove();
    var navMap = nav.map(item => {
        return `
            ${item.menuVOS.length > 0 ? `
            
            <li class="layui-nav-item">
                <a href="javascript:;">
                    <img src="./img/navLogo.png" alt="logo"
                        srcset="">
                            ${item.name}
                </a>
            ${item.menuVOS.length > 0 ?
                    `<dl class="layui-nav-child">
                    ${item.menuVOS.map(i => {
                        return `
                        <dd><a accessKey=${i.url} class="site-demo-active" data-type="tabAdd"
                                href="javascript:;">${i.name}</a>
                        </dd>
                        `
                    }).join('')}
                </dl>`
                    : ''}
        </li>
            
            ` : `
                <li class="layui-nav-item">
                    <a accessKey=${item.url} class="site-demo-active" data-type="tabAdd" href="javascript:;">
                        <img src="./img/navLogo.png" alt="logo"
                                srcset="">
                                ${item.name}
                    </a>
                </li>
            
            ` }
         `
    })




    $('.layui-side .layui-nav').append(navMap.join(''))
    var layFilter = $(".layui-nav").attr('lay-filter');
    $(".layui-side .layui-nav").children(":first").find("a").addClass('layui-this')
    element.render('nav', layFilter);

    //时间格式化
    Date.prototype.Format = function (fmt) { // author: meizz
        var o = {
          "M+": this.getMonth() + 1, // 月份
          "d+": this.getDate(), // 日
          "h+": this.getHours(), // 小时
          "m+": this.getMinutes(), // 分
          "s+": this.getSeconds(), // 秒
          "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
          "S": this.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
      }
      
    //请求天气
    $.ajax({
        url: "https://www.tianqiapi.com/free/day?appid=15729155&appsecret=Lk9ha0e9&city=潍坊",
        success: function (v) {
            var date = new Date()

            $(".layui-layout-right").prepend(`<li class="layui-nav-item" style="margin-right: 36px;color: #fff">${v.tem}℃ ${v.wea} <img src=${function(){
                return `../img/${v.wea_img}.gif`
            }()}></img> ${v.city} ${v.tem_day}℃/${v.tem_night}℃</li>`)
            $(".layui-layout-right").prepend(`<li id='time' class="layui-nav-item" style="margin-right: 14px;color: #fff"></li>`)
            setInterval("document.getElementById('time').innerHTML=new Date().toLocaleString('chinese',{hour12:false})+' 星期'+'日一二三四五六'.charAt(new Date().getDay());",1000);
        },
    });

    //点击跳转

    $("#warn").on('click', function () {
        var x = document.querySelectorAll("a[accessKey]");
        x.forEach(item => {
            if (item.accessKey === 'alarm') {
                item.classList.add('layui-this');
                $(item).parent().parent().parent().addClass(' layui-nav-itemed')
            } else {
                item.classList.remove('layui-this')
                $(item).parent().parent().parent().removeClass('layui-this');
                $(item).parent().removeClass('layui-this');
            }
        })
        $("#homeIframe").attr('src', '../alarm.html');
        $('.layui-body').css('top', '50px')
        element.render('nav', layFilter);
    })

    for (var i = 0; i < $(".site-demo-active").length; i++) {
        $(".site-demo-active")[i].onclick = function () {
            sessionStorage.setItem('location', '')
            localStorage.setItem('companyId', 0)
            var bSrc = $(this).attr('accessKey')
            $("#homeIframe").attr('src', `${bSrc}.html`)
            if (bSrc === 'contentHome') {
                $('.layui-body').css('top', '-10px')
            } else {
                $('.layui-body').css('top', '50px')
            }
        }
    }
    

    //退出登录
    $('.quit').click(function(){
        layer.confirm('您确定要退出吗？', {
            btn: ['确定','取消'] //按钮
          }, function(){
              sessionStorage.removeItem('data0')
            window.open('../index.html', '_self')
          }, function(){
            
          });
    })

    //修改密码
    $('.change').click(function(){
        layer.open({
            type: 1,
            skin: 'layui-layer-demo', //样式类名
            closeBtn: 0, //不显示关闭按钮
            anim: 2,
            area: ['500px','300px'],
            shadeClose: true, //开启遮罩关闭
            content: `
            <form class="layui-form" action="">
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">原密码</label>
                    <div class="layui-input-block">
                        <input type="password" style="width: 85%; margin-top: 20px" name="password" placeholder="请输入原密码" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">新密码</label>
                    <div class="layui-input-block">
                        <input type="password" style="width: 85%" name="newPassword" placeholder="请输入新密码" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">确认密码</label>
                    <div class="layui-input-block">
                        <input type="password" style="width: 85%" name="newPassword2" placeholder="请确认信密码" autocomplete="off"
                            class="layui-input">
                            <p class="tips" style="color: red; display: none">两次密码输入不一致，请重新输入</p>
                    </div>
                </div>
                <div class="layui-form-item  layui-form-item-submit">
                    <div style='text-align: center'>
                        <button type="button" class="layui-btn" lay-submit="" lay-filter="update">确认</button>
                        <button type='button' id="close-pop-up" class="layui-btn">取消</button>
                    </div>
                </div>
            </form>
            `,
            success: function(){
                $("#close-pop-up").click(function () {
                    layer.closeAll();
                })
            }
          });
    })


    //编辑提交
    form.on('submit(update)', function(data){
        if(data.field.newPassword === data.field.newPassword2){
            $.ajax({
                url: baseUrl + '/user/modify?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
                type: 'post',
                contentType: "json/application",
                data: JSON.stringify({
                    userCode: JSON.parse(localStorage.getItem('loginInfo')).userCode,
                    password: data.field.password,
                    newPassword: data.field.newPassword
                }),
                success: function(res){
                    if(res.code === 20001){
                        layer.alert('登录已过期请重新登陆', {
                            skin: 'layui-layer-yingke' //样式类名
                            ,closeBtn: 0
                            }, function(){
                                parent.location.href = './index.html'
                            });
                    } 
                     else if (res.code === 200) {
                        layer.msg('修改密码成功，请重新登录', {
                          icon: 1,
                          closeBtn: 0,
                          shade: 0.5,
                          anim: 0, //动画类型
                          time: 3000
                        }, function () {
                            parent.location.href = './index.html'
                        });
                      } else{
                        layer.msg(res.msg, {
                          icon: 2,
                          closeBtn: 0,
                          anim: 6, //动画类型
                          time: 3000
                        });
                      }
                }
            })
        } else {
            $('.tips').show();
        }
    })

    $.ajax({
        url: baseUrl + '/company/statistics?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
        async:false,
        success: function(res){
            const { rows } = res;
            sessionStorage.setItem('alarmNum', rows.alarmNum)
            var alarmNum = sessionStorage.getItem('alarmNum')
            if(alarmNum !== '0'){
                var flag = false;
                var start = function() {
                    var notice = parent.document.getElementById('icon');
                    var notice1 = parent.document.getElementById('red');
                    if(!flag){
                            notice.style.color = "red";
                            notice1.style.opacity = 1;
                            flag = true;
                        }else{
                            notice.style.color = "white";
                            notice1.style.opacity = 0;
                            flag = false;
                        }
                    setTimeout(start, 500);
                }
                start();
                if(alarmNum > 99){
                    $('#red', window.parent.document).html('99')
                }else{
                    $('#red', window.parent.document).html(alarmNum)
                }
            }else{
                $('#red',window.parent.document).hide()
            }
        }
    })
    //弹窗样式
    layer.config({
        //anim: 2, //出场动画
        extend: 'layskin/style.css',
        // skin: 'layui-layer-yingke' //英科专用弹窗样式
    });
    
})