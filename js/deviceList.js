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
            title: "请选择单位",
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
            if(res.code === 20001){
                layer.alert('登录已过期请重新登陆', {
                    skin: 'layui-layer-yingke' //样式类名
                    ,closeBtn: 0
                    }, function(){
                        parent.location.href = './index.html'
                    });
            } 
            else if(res.code === 200){
                deviceType = res.rows
            }else {
                layer.msg(res.msg, {
                    icon: 2,
                    closeBtn: 0,
                    anim: 6, //动画类型
                    time: 3000
                });
            }
        }
    })


    //所属建筑
    $.ajax({
        url: baseUrl + "/architecture/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token,
        async: false,
        success: function (res) {
            if(res.code === 20001){
                layer.alert('登录已过期请重新登陆', {
                    skin: 'layui-layer-yingke' //样式类名
                    ,closeBtn: 0
                    }, function(){
                        parent.location.href = './index.html'
                    });
            } 
            else if(res.code === 200){
                architecture = res.rows
            }else {
                layer.msg(res.msg, {
                    icon: 2,
                    closeBtn: 0,
                    anim: 6, //动画类型
                    time: 3000
                });
            }

        }
    })



    //关闭弹层


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
            if(res.code === 20001){
                layer.alert('登录已过期请重新登陆', {
                    skin: 'layui-layer-yingke' //样式类名
                    ,closeBtn: 0
                    }, function(){
                        parent.location.href = './index.html'
                    });
            } 
            else if(res.code === 200){
                const { company } = res.rows
                titleBottom = company

                titleContent.company = JSON.parse(localStorage.getItem("loginInfo")).companyName
                titleContent.user = JSON.parse(localStorage.getItem("loginInfo")).phone
                titleContent.address = company.companyAdress
            }else {
                layer.msg(res.msg, {
                    icon: 2,
                    closeBtn: 0,
                    anim: 6, //动画类型
                    time: 3000
                });
            }
        }
    })


    var $p = `
        <p>${titleContent.user}</p>
        <p>${titleContent.address === undefined ? "--" : titleContent.address}</p>
    `




    //下拉框请求
    $.ajax({
        url: baseUrl + "/company/ztreelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        async: false,
        success: function (res) {
            if(res.code === 20001){
                layer.alert('登录已过期请重新登陆', {
                    skin: 'layui-layer-yingke' //样式类名
                    ,closeBtn: 0
                    }, function(){
                        parent.location.href = './index.html'
                    });
            } 
           else if(res.code === 200){
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
           }else {
            layer.msg(res.msg, {
                icon: 2,
                closeBtn: 0,
                anim: 6, //动画类型
                time: 3000
            });
        }
        }
    })



    $(".Realtime-left-top-content").append($p);
    $(".Realtime-left-top-title").html(`${titleContent.company}`);


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

        if (data.field.companyId.length === 0) {
            layer.msg("请选择单位", {
                icon: 2,
                closeBtn: 0,
                anim: 6, //动画类型
                time: 3000
            });
        } else {
            table.reload('tableReload', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    companyId: data.field.companyId,
                    deviceSmallType: typeId,
                    state: state
                }
            });
        }

        return false;
    });

    var $span = `
            <div>
                <p>
                    <span style="background-color: #1191da;"></span>
                    <p  class="first" style="color: #1191da;">总数：${titleBottom.deviceSum}</p>
                </p>
                <p>
                    <span style="background-color: #c82c1f;"></span>
                    <p style="color: #c82c1f;">报警：${titleBottom.deviceAlarm}</p>
                </p>
            </div>
            <div>
                <p>
                    <span style="background-color: #3bd83f;"></span>
                    <p  class="first" style="color: #3bd83f;">在线：${titleBottom.deviceOnLine}</p>
                </p>
                <p>
                    <span style="background-color: #75747c;"></span>
                    <p style="color: #75747c;">离线：${titleBottom.deviceOffLine}</p>
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
            if(res.code === 20001){
                layer.alert('登录已过期请重新登陆', {
                    skin: 'layui-layer-yingke' //样式类名
                    ,closeBtn: 0
                    }, function(){
                        parent.location.href = './index.html'
                    });
            } 
            else if(res.code === 200){
                
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
            }else {
                layer.msg(res.msg, {
                    icon: 2,
                    closeBtn: 0,
                    anim: 6, //动画类型
                    time: 3000
                });
            }
        }
    })

    $(".wisdom-electricity-bottom-top-classify").append(
        `
        <p class="classifyStyle typeScreen"><span style="background: #1191da;"></span>全部 </p>
        <p class="typeScreen"><span style="background: #3bd83f;"></span> 正常 </p>
        <p class="typeScreen"><span style="background: #c82c1f"></span> 报警 </p> 
        <p class="typeScreen"><span style="background: #bf671d"></span> 故障 </p> 
        <p class="typeScreen"><span style="background: #75747c"></span> 离线 </p> 
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
        height: 750,
        url: baseUrl + "/device/tablelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        where: {
            state: state,
            companyId: localStorage.getItem('companyId')
        },
        limit: 15,
        limits: [15, 30, 50, 100, 200, 500, 1000],
        cellMinWidth: 85,
        page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档  
            groups: 5 //只显示 1 个连续页码
            ,
            first: "首页" //不显示首页
            ,
            last: "尾页" //不显示尾页
        },
        even: true,
        skin: 'row',
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "code": 0 , //解析接口状态
                "data": res.rows.rows, //解析数据列表
                "count": res.rows.total,
                'status': res.code,
                'msg': res.msg
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
                    title: '设备状态',
                    align: "center",
                    width: 110,
                    templet: "#sexTpl",
                    sort: true
                },
                {
                    field: 'imei',
                    align: "center",
                    title: '设备编号',
                    width: 150,
                    event: "rowClick"
                },
                {
                    field: 'type',
                    title: '设备类型',
                    align: "center",
                    width: 150,
                    templet: "#typeSign"
                },
                {
                    field: 'companyName',
                    align: "center",
                    title: '设备所属单位'
                },
                {
                    field: 'location',
                    align: "center",
                    title: '设备安装地点'
                },
                {
                    field: 'installationTime',
                    align: "center",
                    title: '安装时间',
                    width: 120,
                    sort: true
                },
                {
                    field: 'toxfTime',
                    align: "center",
                    title: '上传消防时间',
                    width: 150,
                    sort: true
                }
            ]
        ],
        done: function(res){
            if(res.status === 20001){
                layer.alert('登录已过期请重新登陆', {
                    skin: 'layui-layer-yingke' //样式类名
                    ,closeBtn: 0
                    }, function(){
                        parent.location.href = './index.html'
                    });
            } else if(res.status === 200) {
                
            } else {
                layer.msg(res.msg, {
                    icon: 2,
                    closeBtn: 0,
                    anim: 6, //动画类型
                    time: 3000
                });
            }
        }
    });

    table.on('rowDouble(tableTest)', function (obj) {
        let data = obj.data;
        if (data.deviceSmallType === '05') {
            $.ajax({
                url: baseUrl + "/video/info?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
                data: {
                    deviceId: data.id
                },
                success: function (res) {
                    if(res.code === 20001){
                        layer.alert('登录已过期请重新登陆', {
                            skin: 'layui-layer-yingke' //样式类名
                            ,closeBtn: 0
                            }, function(){
                                parent.location.href = './index.html'
                            });
                    } 
                   else if(res.code === 200){
                    layer.open({
                        type: 1,
                        shade: false,
                        title: false, //不显示标题
                        area: '880px', //宽高
                        content: `
                        <div id="video2" style="width: 100%; height: 500px;max-width: 880px;position: relative">
                            <live-player id="live-player" video-url=${res.rows.flvUrl} live="true" stretch="true" aspect='fullscreen' controls="true" hide-big-play-button="true"></live-player>
                        </div>
                        `
                    });
                   }else {
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
            layer.open({
                type: 2,
                id: "iframe",
                skin: 'layui-layer-yingke',
                title: false,
                closeBtn: 0, //不显示关闭按钮
                title: '设备详情',
                shade: [0],
				offset:50,
                scrollbar: true,
                closeBtn: 1,
                area: ['70%', '81%'],
                shadeClose: true,
                anim: 0,
                content: [`../demo.html?id=${data.id}`, 'no'], //iframe的url，no代表不显示滚动条
            });
        }


    })
    


    
    //获取建筑
    form.on('select(companyId-select)', function (data) {
        //data.value 得到被选中的值
        var url = baseUrl + "/architecture/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token + "&companyId=" + data.value;
        $.get(url, function (data) {
            $("#architectureId-select").empty();
            $("#architectureId-select").append(new Option("请选择建筑", ""));
            $.each(data.rows, function (index, item) {
                $("#architectureId-select").append(new Option(item.architectureName, item.id));
            });
            layui.form.render("select");
        });

    });

    form.on('select(companyId-select1)', function (data) {
        //data.value 得到被选中的值
        var url = baseUrl + "/architecture/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token + "&companyId=" + data.value;
        $.get(url, function (data) {
            $("#architectureId-select1").empty();
            $("#architectureId-select1").append(new Option("请选择建筑", ""));
            $.each(data.rows, function (index, item) {
                $("#architectureId-select1").append(new Option(item.architectureName, item.id));
            });
            layui.form.render("select");
        });

    });



    $(".wisdom-electricity-bottom-top-type > span").on("click", function () {
        $(this).addClass("classifyStyle");
        $(this).siblings('span').removeClass('classifyStyle');
    });


    //新增设备提交
    form.on('submit(demo1)', function (data) {

        for (var i = 0; i < Object.keys(data.field).length; i++) {

            if (data.field[Object.keys(data.field)[i]].length === 0) {
                delete data.field[Object.keys(data.field)[i]]
            }
        }

        $.ajax({
            url: baseUrl + "/device/save?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify(data.field),
            contentType: "json/application",
            type: 'post',
            dataType: "json",
            success: function (res) {
                table.reload('tableReload', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    },
                    where: {
                        state: state,
                    }
                });
                if(res.code === 20001){
                    layer.alert('登录已过期请重新登陆', {
                        skin: 'layui-layer-yingke' //样式类名
                        ,closeBtn: 0
                        }, function(){
                            parent.location.href = './index.html'
                        });
                } 
                else if (res.code === 200) {
                    layer.msg('设备添加成功', {
                        icon: 1,
                        closeBtn: 0,
                        shade: 0.5,
                        shadeClose: true,
                        anim: 0, //动画类型
                        time: 2000
                    }, function () {
                        layer.closeAll();
                    });
                } else {
                    layer.msg(res.msg, {
                        icon: 2,
                        closeBtn: 0,
                        anim: 6, //动画类型
                        time: 3000
                    });
                }
            }
        })
        return false;
    });

    //编辑设备提交
    form.on('submit(update)', function (data) {

        for (var i = 0; i < Object.keys(data.field).length; i++) {
            if (data.field[Object.keys(data.field)[i]].length === 0) {
                delete data.field[Object.keys(data.field)[i]]
            }
        }

        $.ajax({
            url: baseUrl + "/device/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify(data.field),
            contentType: "json/application",
            type: 'post',
            dataType: "json",
            success: function (res) {
                table.reload('tableReload', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    },
                    where: {
                        state: state,
                        deviceSmallType: typeId
                    }
                });
                if(res.code === 20001){
                    layer.alert('登录已过期请重新登陆', {
                        skin: 'layui-layer-yingke' //样式类名
                        ,closeBtn: 0
                        }, function(){
                            parent.location.href = './index.html'
                        });
                } 
                else if (res.code === 200) {
                    layer.msg('修改设备成功^_^', {
                        icon: 1,
                        closeBtn: 0,
                        shade: 0.5,
                        shadeClose: true,
                        anim: 0, //动画类型
                        time: 2000
                    }, function () {
                        layer.closeAll();
                    });

                } else {
                    layer.msg(res.msg, {
                        icon: 2,
                        closeBtn: 0,
                        anim: 6, //动画类型
                        time: 3000
                    });
                }
            }
        })
        return false;
    });

    //弹窗样式
    layer.config({
        //anim: 2, //出场动画
        extend: 'layskin/style.css',
        //skin: 'layui-layer-yingke' //英科专用弹窗样式
    });

})