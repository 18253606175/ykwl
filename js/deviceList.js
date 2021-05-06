import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer', 'table', 'form'], function () {
    var $ = layui.jquery
    var element = layui.element;
    var table = layui.table;
    var form = layui.form

    var tableData = []

    //监听行单击事件（双击事件为：rowDouble）
    table.on('row(tableTest)', function (obj) {
        var data = obj.data;
        // layer.alert(JSON.stringify(data), {
        //     title: '当前行数据：'
        // });
        //标注选中样式
        obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');

        layer.open({
            type: 2,
            id: "iframe",
            title: false,
            closeBtn: 0, //不显示关闭按钮
            title: '设备详情',
            shade: [0],
            scrollbar: true,
            closeBtn: 1,
            area: ['65%', '81%'],
            shadeClose: true,
            anim: 0,
            content: [`../demo.html?deviceId=${data.deviceId}`, 'no'], //iframe的url，no代表不显示滚动条
        });


    });
    //头部内容

    var titleContent = {
        company: "英科",
        user: "例",
        address: "地址"
    }

    var titleBottom = {
        device: 10,
        alarm: 10,
        online: 10,
        offline: 10
    }


    var $p = `
        <p>${titleContent.company}</p>
        <p>${titleContent.user}</p>
        <p>${titleContent.address}</p>
    `

    //下拉框value
    var selectDate = [{
            title: '没有选项',
            value: " "
        }
    ]


    //下拉框请求
    $.ajax({
        url: baseUrl + "/company/ztreelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        success: function(res){
            var selectDate1 = res.rows.map(item=>{
                return {
                    title: item.companyName,
                    value: item.id
                }
            })
            selectDate = selectDate.concat(selectDate1)
            console.log(selectDate)
            var selectMap = selectDate.map(item => {
                return `
                    <option value=${item.value}>${item.title}</option>
                `
            })
        
            $(".layui-input-inline-select").html(selectMap.join(''));
            form.render();
        }
    })


    
    $(".Realtime-left-top-content").append($p);


    //监听提交搜索
    form.on('submit(submitBtn)', function (data) {
        table.render({
            elem: '#home',
            height: 740,
            url: baseUrl + "/device/tablelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            where: {
                location: data.field.location,
                deviceSmallType: typeId,
                state: state
            },
            limit: 15,
            limits: [15, 30, 45],
            cellMinWidth: 85,
            page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档  
                groups: 5 //只显示 1 个连续页码
                    ,
                first: false //不显示首页
                    ,
                last: false //不显示尾页
            },
            even: true,
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "data": res.rows.rows, //解析数据列表
                    "count": res.rows.total,
                };
            },
            request: {
                pageName: 'pageNumber' //页码的参数名称，默认：page
                    ,
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            cols: [
                [ //表头
                    {
                        field: 'type',
                        title: '状态',
                        width: 60,
                        templet: "#sexTpl"
                    },
                    {
                        field: 'imei',
                        title: '设备编号'
                    },
                    {
                        field: 'deviceName',
                        title: '设备名称'
                    },
                    {
                        field: 'type',
                        title: '设备类型',
                        templet: "#typeSign"
                    },
                    {
                        field: 'location',
                        title: '设备安装地点'
                    },
                    {
                        field: 'installationTime',
                        title: '设备安装时间'
                    },
                ]
            ]
        });


        return false;
    });

    form.on('submit(submitDoubleBtn)', function (data) {

        

        // console.log(data.field)

        table.reload('tableReload', {
            page: {
              curr: 1 //重新从第 1 页开始
            },
            where: {
                companyId: data.field.companyId
            }
          });

        
        return false;
    });

    var $span = `
            <div>
                <p>
                    <span style="background-color: #346a99;"></span>
                    <p style="color: #346a99;">设备：${titleBottom.device}</p>
                </p>
                <p>
                    <span style="background-color: #d2b207;"></span>
                    <p style="color: #d2b207;">报警：${titleBottom.alarm}</p>
                </p>
            </div>
            <div>
                <p>
                    <span style="background-color: #319499;"></span>
                    <p style="color: #319499;">在线：${titleBottom.online}</p>
                </p>
                <p>
                    <span style="background-color: #b82e00;"></span>
                    <p style="color: #b82e00;">离线：${titleBottom.offline}</p>
                </p>
            </div>
    `

    $(".Realtime-left-top-bottom").append($span);


    //设备类型分类

    var typeSum = []

    //设备总数
    var typeCount = []

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

            var leftTypeDate = leftType.map((item, index) => {

                return `
                        <li class="layui-nav-item select-li"><a href="javaScript:;">${item}<blockquote class="layui-elem-quote layui-quote-nm"><span class="layui-badge">${typeCount[index]}</span></blockquote> </a></li>
                    `

            })

            $(".Realtime-left-bottom > .layui-nav").append(leftTypeDate.join(''));

            for (var i = 0; i < document.getElementsByClassName("select-li").length; i++) {

                $(".Realtime-left-bottom > .layui-nav > li")[i].setAttribute("index", i)

                $(".Realtime-left-bottom > .layui-nav > li")[i].onclick = function () {
                    // for (var j = 0; j < $(".Realtime-left-bottom > .layui-nav > li").length - 1; j++) {
                    //     $(".wisdom-electricity-bottom > div")[j].className = "";
                    // }
                    typeSum = Number(this.getAttribute('index')) + 1
                    if (typeSum === 1) {
                        typeId = '01'
                    } else if (typeSum === 2) {
                        typeId = '02'
                    } else if (typeSum === 3) {
                        typeId = '03'
                    } else if (typeSum === 4) {
                        typeId = '06'
                    } else if (typeSum === 5) {
                        typeId = '05'
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












    $(".wisdom-electricity-bottom-top-classify").append(
        `
        <p class="classifyStyle typeScreen"><span style="background: #1191da;"></span>全部</p>
        <p class="typeScreen"><span style="background: #184f6d;"></span> 正常</p>
        <p class="typeScreen"><span style="background: #c82c1f"></span> 报警</p> 
        <p class="typeScreen"><span style="background: #bf671d"></span> 故障</p> 
        <p class="typeScreen"><span style="background: #75747c"></span> 离线</p> 
        `
    )

    $(".wisdom-electricity-bottom-top-classify > p").on("click", function () {
        $(this).addClass("classifyStyle");
        $(this).siblings('p').removeClass('classifyStyle');
    });

    var typeId = null;
    var state = 0;

    //初始化渲染全部类型

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

    table.render({
        elem: '#home',
        id: 'tableReload',
        height: 740,
        url: baseUrl + "/device/tablelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        where:{
            state: state
        },
        limit: 15,
        limits: [15, 30, 45],
        cellMinWidth: 85,
        page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档  
            groups: 5 //只显示 1 个连续页码
                ,
            first: false //不显示首页
                ,
            last: false //不显示尾页
        },
        even: true,
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "code": 0, //解析接口状态
                "data": res.rows.rows, //解析数据列表
                "count": res.rows.total,
            };
        },
        request: {
            pageName: 'pageNumber' //页码的参数名称，默认：page
                ,
            limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        cols: [
            [ //表头
                {
                    field: 'type',
                    title: '状态',
                    width: 60,
                    templet: "#sexTpl"
                },
                {
                    field: 'imei',
                    title: '设备编号'
                },
                {
                    field: 'deviceName',
                    title: '设备名称'
                },
                {
                    field: 'type',
                    title: '设备类型',
                    templet: "#typeSign"
                },
                {
                    field: 'location',
                    title: '设备安装地点'
                },
                {
                    field: 'installationTime',
                    title: '设备安装时间'
                },
            ]
        ]
    });



    $(".wisdom-electricity-bottom-top-type > span").on("click", function () {
        $(this).addClass("classifyStyle");
        $(this).siblings('span').removeClass('classifyStyle');
    });


    for (var i = 0; i < $('.button-add').length; i++) {
        $('.button-add')[i].onclick = function () {
            layer.open({
                type: 1,
                offset: '180px',
                title: '添加设备',
                area: ['1000px', '400px'],
                content: $("#pop-up-add")
            });
        }
    }

    //监听提交
    form.on('submit(demo1)', function (data) {
        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        })
        return false;
    });

    //关闭弹层

    $("#close-pop-up").click(function () {
        layer.closeAll();
    })
})