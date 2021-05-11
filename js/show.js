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
                    ${item.menuVOS.map(i=>{
                        return `
                        <dd><a accessKey=${i.url} class="site-demo-active" data-type="tabAdd"
                                href="javascript:;">${i.name}</a>
                        </dd>
                        `
                    }).join('')}
                </dl>`
                :''}
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
    $(".layui-side .layui-nav").children(":first").addClass('layui-this')
    element.render('nav', layFilter);



    //点击跳转

    $("#warn").on('click', function () {
        $("#homeIframe").attr('src', '../alarm.html');
        $('.layui-body').css('top', '50px')
        
    })

    for (var i = 0; i < $(".site-demo-active").length; i++) {
        $(".site-demo-active")[i].onclick = function () {
            var bSrc = $(this).attr('accessKey')
            $("#homeIframe").attr('src', `${bSrc}.html`)
            if (bSrc === 'contentHome') {
                $('.layui-body').css('top', '-10px')
            } else {
                $('.layui-body').css('top', '50px')
            }
        }
    }
})