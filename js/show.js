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
                    <img src="http://fire.acrelcloud.cn/image/597d1e53922a46179d28a0a56c318652.png" alt="logo"
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
                        <img src="http://fire.acrelcloud.cn/image/762eba98110b430f9d4c283ccf60c941.png" alt="logo"
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
        $("#homeIframe").attr('src', '../html/faultHand.html');

        $(".site-demo-active").removeClass('layui-this');
        $(".site-demo-active17").addClass("layui-this");
    })

    for (var i = 0; i < $(".site-demo-active").length; i++) {
        $(".site-demo-active")[i].onclick = function () {
            // if($(this).context.accessKey === '1') {
            //     $("#homeIframe").attr('src', '../html/contentHome.html')
            //     $('.layui-body').css('top', '0px')
            // } else if ($(this).context.accessKey === '2') {
            //     $("#homeIframe").attr('src', '../html/realtime.html')
            //     $('.layui-body').css('top', '50px')
            // } else if ($(this).context.accessKey === '3') {
            //     $("#homeIframe").attr('src', '../html/projectDes.html')
            //     $('.layui-body').css('top', '50px')
            // }else if ($(this).context.accessKey === '4') {
            //     $("#homeIframe").attr('src', '../html/unitManage.html')
            //     $('.layui-body').css('top', '50px')
            // }else if ($(this).context.accessKey === '5') {
            //     $("#homeIframe").attr('src', '../html/manage.html')
            //     $('.layui-body').css('top', '50px')
            // }
            // else if ($(this).context.accessKey === '17') {
            //     $("#homeIframe").attr('src', '../html/faultHand.html')
            //     $('.layui-body').css('top', '50px')
            // }
            // else if ($(this).context.accessKey === '33') {
            //     $("#homeIframe").attr('src', '../html/userManage.html')
            //     $('.layui-body').css('top', '50px')
            // }
            var bSrc = $(this).attr('accessKey')
            $("#homeIframe").attr('src', `../html/${bSrc}.html`)
            if (bSrc === 'sy') {
                $('.layui-body').css('top', '0px')
            } else {
                $('.layui-body').css('top', '50px')
            }
        }
    }

})