import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer'], function () {
    var form = layui.form
    var $ = layui.jquery

    //请求列表数据
    $.ajax({
        url: baseUrl + "/inspectadd/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        async: false,
        success: function(res){
            const card = res.rows.map(item=>{
                return `
                <div>
                    <div>

                    </div>
                    <section>${item.inspectType}</section>
                    <aside>
                        <article><span class="layui-badge layui-bg-green">已检查</span></article>
                        <p>NFC卡号: ${item.nfcid}</p>
                        <p class="location">位置: ${item.locationDesc}</p>
                        <p>巡检时间：2020-12-11</p>
                    </aside>
                </div> 
                       `
            })

            $(".inspectList").append(card.join(""))
        }
    })

    if($(".location").height() > 40){
        $(".location").css("overflow", "hidden")
    }

    //监听提交搜索
    form.on('submit(submitBtn)', function (data) {

        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        })
        return false;
    });

    form.on('submit(submitDoubleBtn)', function (data) {

        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        })
        return false;
    });


})