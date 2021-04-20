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
            content: [`../html/demo.html?deviceId=${data.deviceId}`, 'no'], //iframe的url，no代表不显示滚动条
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
        },
        {
            title: "英科1",
            value: 1
        },
        {
            title: "英科2",
            value: 2
        },
        {
            title: "英科3",
            value: 3
        },
        {
            title: "英科4",
            value: 4
        },
        {
            title: "英科5",
            value: 5
        },
    ]

    //左侧分类
    var leftType = ["智慧消防", "消防水", "NB烟感", "视频监控"]

    var selectMap = selectDate.map(item => {
        return `
            <option value=${item.value}>${item.title}</option>
        `
    })

    $(".layui-input-inline-select").html(selectMap.join(''));
    form.render();
    $(".Realtime-left-top-content").append($p);


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


    var leftTypeDate = leftType.map(item => {
        return `
            <li class="layui-nav-item"><a href="javaScript:;">${item}</a></li>
        `
    })

    $(".Realtime-left-bottom > .layui-nav").append(leftTypeDate.join(''));

    $(".Realtime-left-bottom > .layui-nav li a").on('click', function () {
        if ($(this).context.innerHTML) {
            $(".wisdom-electricity-bottom-video iframe").attr("src", '../html/video.html');
            var frame = $("#video");

            var frameheight = $(window).height();

            // frame.css("height", 100%);
        }
    })

    $(".Realtime-left-bottom > .layui-nav > li").on("click", function () {
        $(this).addClass("layui-this");
        $(this).siblings('li').removeClass('layui-this');
    });


    $(".wisdom-electricity-bottom-top-classify").append(
        `
        <p class="classifyStyle"><span style="background: #184f6d;"></span> 正常</p>
        <p><span style="background: #c82c1f"></span> 报警</p> 
        <p><span style="background: #bf671d"></span> 故障</p> 
        <p><span style="background: #75747c"></span> 离线</p> 
        `
    )

    $(".wisdom-electricity-bottom-top-classify > p").on("click", function () {
        $(this).addClass("classifyStyle");
        $(this).siblings('p').removeClass('classifyStyle');
    });

    var typeId = 0;

    console.log()
    table.render({
        elem: '#home',
        height: 740,
        url: baseUrl + "/rest/device/tablelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        where: {
            id: typeId
        },
        cellMinWidth: 85,
        page: true, //开启分页
        even: true,
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "code": 0, //解析接口状态
                "data": res.rows.rows //解析数据列表
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
                    field: 'deviceName',
                    title: '设备类型'
                },
                {
                    field: 'location',
                    title: '设备安装地点'
                },
                {
                    field: 'createTime',
                    title: '设备安装时间'
                },
            ]
        ]
    });

    for (var i = 0; i < $(".Realtime-left-bottom > .layui-nav > li").length; i++) {
        $(".Realtime-left-bottom > .layui-nav > li")[i].setAttribute("index", i)
        $(".Realtime-left-bottom > .layui-nav > li")[i].onclick = function () {
            for (var j = 0; j < $(".wisdom-electricity-bottom > div").length; j++) {
                $(".wisdom-electricity-bottom > div")[j].className = "";
            }
            typeId = Number(this.getAttribute("index")) + 1
            if (typeId === 1) {
                var elemName = '#electricity'
            } else if (typeId === 2) {
                var elemName = '#water'
            } else if (typeId === 3) {
                var elemName = '#nb'
            }
            table.render({
                elem: elemName,
                height: 740,
                url: baseUrl + "/rest/device/tablelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
                where: {
                    id: typeId
                },
                cellMinWidth: 85,
                page: true, //开启分页
                even: true,
                parseData: function (res) { //res 即为原始返回的数据
                    return {
                        "code": 0, //解析接口状态
                        "data": res.rows.rows //解析数据列表
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
                            field: 'deviceName',
                            title: '设备类型'
                        },
                        {
                            field: 'location',
                            title: '设备安装地点'
                        },
                        {
                            field: 'createTime',
                            title: '设备安装时间'
                        },
                    ]
                ]
            });
            $(".wisdom-electricity-bottom > div")[Number(this.getAttribute("index")) + 1].className = "current";
        }
    }

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