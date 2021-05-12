import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer', 'flow'], function () {
    var flow = layui.flow;
    var form = layui.form
    var $ = layui.jquery

    //头部内容

    var titleContent = {
        company: "英科",
        user: "例",
        address: "地址"
    }

    var titleBottom = {
        deviceSum: 10,
        deviceAlarm: 10,
        deviceOnLine: 10,
        deviceOffLine: 10
    }


    // 请求头部内容
    $.ajax({
        url: baseUrl + '/company/infoanddevicetype?token=' + JSON.parse(localStorage.getItem('loginInfo')).token + '&companyId=' + JSON.parse(localStorage.getItem('loginInfo')).companyId,
        async: false,
        success: function (res) {
            const { company } = res.rows
            titleBottom = company

            titleContent.company = JSON.parse(localStorage.getItem("loginInfo")).companyName
            titleContent.user = JSON.parse(localStorage.getItem("loginInfo")).phone
            titleContent.address = company.companyAdress
        }
    })


    var $p = `
        <p>${titleContent.user}</p>
        <p>${titleContent.address === undefined ? "--" : titleContent.address}</p>
    `
    $(".Realtime-left-top-content").append($p);
    $(".Realtime-left-top-title").html(`${titleContent.company}`);


     var $span = `
            <div>
                <p>
                    <span style="background-color: #1191da;"></span>
                    <p  class="first" style="color: #1191da;">统计：${titleBottom.deviceSum}</p>
                </p>
                <p>
                    <span style="background-color: #c82c1f;"></span>
                    <p style="color: #c82c1f;">巡检：${titleBottom.deviceAlarm}</p>
                </p>
            </div>
            <div>
                <p>
                    <span style="background-color: #3bd83f;"></span>
                    <p  class="first" style="color: #3bd83f;">未巡检：${titleBottom.deviceOnLine}</p>
                </p>
                <p>
                    <span style="background-color: #75747c;"></span>
                    <p style="color: #75747c;">巡检率：${titleBottom.deviceOffLine}</p>
                </p>
            </div>
    `

    $(".Realtime-left-top-bottom").append($span);

    //设备类型分类

    var typeSum = []

    //设备总数
    var typeCount = []

    //左侧导航栏
    $.ajax({
        url: baseUrl + '/device/devicetypewithnum?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
        success: function (res) {
            const {
                rows
            } = res
            var leftType = rows.map(item => {
                typeSum.push(item.type)
                typeCount.push(item.count)
                return item.type_sign
            })



            var leftTypeDate = rows.map((item, index) => {

                return `
                        <li class="layui-nav-item select-li" id=${item.type}><a href="javaScript:;">${item.type_sign}<blockquote class="layui-elem-quote layui-quote-nm"><span class="layui-badge">${typeCount[index]}</span></blockquote> </a></li>
                    `
            })

            $(".Realtime-left-bottom > .layui-nav").append(leftTypeDate.join(''));

            for (var i = 0; i < document.getElementsByClassName("select-li").length; i++) {

                $(".Realtime-left-bottom > .layui-nav > li")[i].setAttribute("index", i)

                $(".Realtime-left-bottom > .layui-nav > li")[i].onclick = function () {
                    // for (var j = 0; j < $(".Realtime-left-bottom > .layui-nav > li").length - 1; j++) {
                    //     $(".wisdom-electricity-bottom > div")[j].className = "";
                    // }
                    typeId = this.getAttribute('id')



                    table.reload('tableReload', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        },
                        where: {
                            state: state,
                            deviceSmallType: typeId
                        }
                    });



                    // $(".wisdom-electricity-bottom > div")[Number(this.getAttribute("index")) + 1].className = "current";

                    //小类型状态筛选
                    for (var i = 0; i < document.getElementsByClassName("typeScreen").length; i++) {
                        $(".typeScreen")[i].setAttribute("index", i)
                        $(".typeScreen")[i].onclick = function () {
                            if (Number(this.getAttribute("index")) === 0) {
                                state = '0'
                            }
                            if (Number(this.getAttribute("index")) === 4) {
                                state = '2'
                            }
                            if (Number(this.getAttribute("index")) === 1) {
                                state = '1'
                            }
                            if (Number(this.getAttribute("index")) === 2) {
                                state = '3'
                            }
                            if (Number(this.getAttribute("index")) === 3) {
                                state = '4'
                            }


                            table.reload('tableReload', {
                                page: {
                                    curr: 1 //重新从第 1 页开始
                                },
                                where: {
                                    state: state,
                                    deviceSmallType: typeId
                                }
                            });



                        }
                    }
                }


            }



            $(".select-li").on('click', function () {
                $(this).addClass("layui-this");
                $(this).siblings('li').removeClass('layui-this');
            });


            // 视频监控

            // $(".Realtime-left-bottom > .layui-nav li a").on('click', function () {
            //     if ($(this).context.innerHTML) {
            //         $(".wisdom-electricity-bottom-video iframe").attr("src", '../video.html');
            //         var frame = $("#video");

            //         var frameheight = $(window).height();

            //         // frame.css("height", 100%);
            //     }
            // })
        }
    })

    //流加载请求列表数据
    flow.load({
        elem: '#flow_inspectList' //流加载容器
        ,scrollElem: '#flow_inspectList' //滚动条所在元素，一般不用填，此处只是演示需要。
        ,done: function(page, next){ //执行下一页的回调
            var lis = [];
          //模拟数据插入
          
            $.ajax({
                url: baseUrl + "/inspectadd/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
                async: false
                ,md: 100,
                data: {
                    pageNumber: page,
                    pageSize: 20
                },
                success: function(res){
                    layui.each(res.rows.rows, function (index, item) {
                        //这里遍历数据
                        lis.push(
                            `
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
                            );
                    });

                    // const card = res.rows.rows.map(item=>{
                    //     return `
                    //     <div>
                    //         <div>

                    //         </div>
                    //         <section>${item.inspectType}</section>
                    //         <aside>
                    //             <article><span class="layui-badge layui-bg-green">已检查</span></article>
                    //             <p>NFC卡号: ${item.nfcid}</p>
                    //             <p class="location">位置: ${item.locationDesc}</p>
                    //             <p>巡检时间：2020-12-11</p>
                    //         </aside>
                    //     </div> 
                    //            `
                    // })
                    next(lis.join(''), page < res.rows.pageCount);
                }
            })
          
        }
      });
   

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