import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer', 'table', 'form', 'laydate'], function () {
    var $ = layui.jquery
    var element = layui.element;
    var table = layui.table;
    var form = layui.form
    var laydate = layui.laydate;
    //下拉框value
    var selectDate = [
        {
            title: "没有选项",
            value: ""
        }
    ]

    var selectList = []
    var tableData = []

    var deviceType = [] //设备类型
    var architecture = [] //建筑
    var fllorNum = [] //楼层
    for (var i = -3; i <= 20; i++) {
        fllorNum.push(i)
    }

    //设备类型
    $.ajax({
        url: baseUrl + "/prodect/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token,
        async: false,
        success: function (res) {
            deviceType = res.rows
        }
    })


    //所属楼层
    $.ajax({

    })


    //所属建筑
    $.ajax({
        url: baseUrl + "/architecture/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token,
        async: false,
        success: function (res) {
            architecture = res.rows

        }
    })



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
        <p>${titleContent.address === undefined ? "" : titleContent.address}</p>
    `




    //下拉框请求
    $.ajax({
        url: baseUrl + "/company/ztreelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        async: false,
        success: function (res) {
            var selectDate1 = res.rows.map(item => {
                return {
                    title: item.companyName,
                    value: item.id
                }
            })
            selectDate = selectDate.concat(selectDate1)
            selectList = res.rows
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

        table.reload('tableReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                location: data.field.location,
                deviceSmallType: typeId,
                state: state
            }
        });


        return false;
    });

    form.on('submit(submitDoubleBtn)', function (data) {

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
                    <p  class="first" style="color: #346a99;">设备：${titleBottom.deviceSum}</p>
                </p>
                <p>
                    <span style="background-color: #d2b207;"></span>
                    <p style="color: #d2b207;">报警：${titleBottom.deviceAlarm}</p>
                </p>
            </div>
            <div>
                <p>
                    <span style="background-color: #3bd83f;"></span>
                    <p  class="first" style="color: #3bd83f;">在线：${titleBottom.deviceOnLine}</p>
                </p>
                <p>
                    <span style="background-color: #b82e00;"></span>
                    <p style="color: #b82e00;">离线：${titleBottom.deviceOffLine}</p>
                </p>
            </div>
    `

    $(".Realtime-left-top-bottom").append($span);
    $(".Realtime-left-top-title").html(`${titleContent.company}`);


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


        }
    })


    $(".wisdom-electricity-bottom-top-classify").append(
        `
        <p class="classifyStyle typeScreen"><span style="background: #1191da;"></span>全部</p>
        <p class="typeScreen"><span style="background: #3bd83f;"></span> 正常</p>
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
        height: 780,
        url: baseUrl + "/alarm/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
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
        skin: 'row',
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
                    field: 'alarmMessage',
                    title: '报警类别',
                    align: "center",
                },
                {
                    field: 'imei',
                    align: "center",
                    title: '设备编号'
                },
                {
                    field: 'type_sign',
                    title: '设备类型',
                    align: "center",
                    templet: "#typeSign"
                },
                {
                    field: 'location',
                    align: "center",
                    width: 230,
                    title: '设备报警地点'
                },
                {
                    field: 'alarmTime',
                    align: "center",
                    title: '设备报警时间'
                },
                {
                    field: 'alarmData',
                    align: "center",
                    title: '报警值'
                },
                {
                    field: 'isSolve',
                    align: "center",
                    title: '处理状态',
                    templet: "#isSolve"
                },
                {
                    fixed: 'right',
                    title: '操作',
                    align: "center",
                    toolbar: '#barDemo'
                }
            ]
        ]
    });



    $(".wisdom-electricity-bottom-top-type > span").on("click", function () {
        $(this).addClass("classifyStyle");
        $(this).siblings('span').removeClass('classifyStyle');
    });



   
    //弹窗样式
    layer.config({
        //anim: 2, //出场动画
        extend: 'layskin/style.css',
        skin: 'layui-layer-yingke' //英科专用弹窗样式
      });

})