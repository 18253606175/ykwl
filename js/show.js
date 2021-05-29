layui.use(['element'], function () {
    var $ = layui.jquery
    var element = layui.element;


    //循环侧边导航栏
    var nav = JSON.parse(localStorage.getItem('loginInfo')).roleCode.menuVOS
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

    
    //报警闪烁
    var flag = false;
    var start = function() {
        var notice = document.getElementById('icon');
        var notice1 = document.getElementById('red');
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

    
})