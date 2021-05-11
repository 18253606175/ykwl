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

    $(".button-add").click(function () {
        $("#pop-up-add").html(
            `
            <form class="layui-form" action="">
            <div class="layui-form-item">
                <label class="layui-form-label layui-required">所属单位</label>
                <div class="layui-input-block">
                    <select name="companyId" lay-verify="required" lay-search="">
                        <option value="">请选择单位</option>
                        ${selectList.map(item => {
                return `
                                        <option value=${item.id}>${item.companyName}</option>
                                    `
            })}
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label layui-required">设备类型</label>
                <div class="layui-input-block">
                    <select name="typeSign" lay-verify="required" lay-search="">
                        <option value=""></option>
                        ${deviceType.map(item => {
                return `<option value=${item.typeSign}>${item.typeName}</option>`
            })}
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label layui-required">设备编号</label>
                <div class="layui-input-block">
                    <input type="text" name="imei" lay-verify="imei" required placeholder="请输入" autocomplete="off"
                        class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
            <label class="layui-form-label layui-required">位置描述</label>
            <div class="layui-input-block">
                <input type="text" name="location" lay-verify="address" required placeholder="请输入" autocomplete="off"
                    class="layui-input">
            </div>
        </div>
            <div class="layui-form-item">
                <label class="layui-form-label">所属建筑</label>
                <div class="layui-input-block">
                    <select name="architectureId" lay-search="" lay-filter="buildingFilter">
                        <option value=""></option>
                        ${architecture.map((item, i) => {
                $(".layui-form-select").accessKey = i
                return `<option value=${item.id}>${item.architectureName}</option>`
            })}
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">所属楼层</label>
                <div class="layui-input-block">
                    <select name="floor" lay-search="">
                        <option value=""></option>
                        ${function () {
                var fllorNum = [] //楼层
                for (var i = -3; i <= 20; i++) {
                    fllorNum.push(i)
                }
                return fllorNum.map(item => {
                    return `${function () {
                        if (item === 1) {
                            return `<option value=${item} selected=${item === "1" ? true : false}>${item}</option>`
                        } else {
                            return `<option value=${item}>${item}</option>`
                        }
                    }()}`
                })
            }()
            }
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">安装日期</label>
                <div class="layui-input-block">
                <input type="text" name="installationTime" id="date"  placeholder="请选择安装日期" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">SIM卡号</label>
                <div class="layui-input-block">
                    <input type="text" name="iccid" placeholder="请输入" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">设备名称</label>
                <div class="layui-input-block">
                    <input type="text" name="deviceName" placeholder="请输入" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item  layui-form-item-submit">
                <div class="layui-input-block">
                    <button type="submit" class="layui-btn" lay-submit lay-filter="demo1">确认</button>
                </div>
            </div>
        </form>
        <button id="close-pop-up" class="layui-btn">取消</button>
            `
        )

        form.render()
        laydate.render({
            elem: '#date',
            type: 'datetime'
        });
        $("#close-pop-up").click(function () {
            layer.closeAll();
        })


        form.verify({  
            imei: [  
            /^[\S]{15,15}$/  
            ,'IEMI必须是15位数字'  
            ],  
            address: function(value){  
            if(value.length < 5){  
                return '地址不够详细，至少得6个字';  
                }  
            }  
            }); 
    })

    //关闭弹层







    //表格编辑删除
    table.on('tool(tableTest)', function (obj) {
        var data = obj.data;
        //表格编辑删除
        if (obj.event === 'del') {
            layer.prompt({
                title: '请输入密码', 
                formType: 1,
            }, 
                function(pass, index){
                    $.ajax({
                        url: baseUrl + "/device/delete?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
                        contentType: "application/json",
                        data: JSON.stringify({
                            id: data.id,
                            password: pass
                        }),
                        type: 'post',
                        // dataType: "json",
                        success: function(res){
                            if(res.code === 200){
                                obj.del();
                                layer.msg('删除成功',{
                                    skin: 'layui-layer-yingke'
                                    , closeBtn: 0
                                    // ,anim: 4 //动画类型
                                    , yes: function (index, layero) {
                                        layer.closeAll();
                                    }
                                });
                                
                            } else {
                                layer.msg(res.msg, {
                                    skin: 'layui-layer-yingke'
                                    , closeBtn: 0
                                    // ,anim: 4 //动画类型
                                    , yes: function (index, layero) {
                                        layer.closeAll();
                                    }
                                });
                            }
                        }
                    })
                layer.close(index);
              });
            // layer.confirm('真的删除行么', function (index) {
            //     obj.del();
            //     layer.close(index);
            // });
        } else if (obj.event === 'edit') {
            layer.open({
                type: 1,
                offset: '180px',
                title: '编辑设备',
                area: ['1000px', '400px'],
                content: $("#pop-up-add"),
                success: function (layero, index) {
                    $("#pop-up-add").html(
                        `
                <form class="layui-form" action="">
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">所属单位</label>
                    <div class="layui-input-block">
                        <select name="companyId" lay-verify="required" lay-search="">
                        <option value="">请选择单位</option>
                        ${selectList.map(item => {
                            return `
                                ${function () {
                                    if (item.id === data.companyId) {
                                        return `<option selected="true" value=${item.id}>${item.companyName}</option>`
                                    } else {
                                        return `<option value=${item.id}>${item.companyName}</option>`
                                    }
                                }()
                                }
                            `
                        })}
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">设备类型</label>
                    <div id="tySign"  class="layui-input-block">
                        <select name="typeSign" lay-verify="required" disabled lay-search="">
                            <option value=""></option>
                            ${deviceType.map(item => {
                            return `
                                    ${function () {
                                    if (item.typeSign === data.typeSign) {
                                        return `<option selected="true" value=${item.typeSign}>${item.typeName}</option>`
                                    } else {
                                        return `<option value=${item.typeSign}>${item.typeName}</option>`
                                    }
                                }()
                                }
                            `
                        })}
                            
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">设备编号</label>
                    <div class="layui-input-block">
                        <input type="text" name="imei" lay-verify="imei" required disabled placeholder="请输入" autocomplete="off"
                            class="layui-input layui-disabled" value=${data.imei}>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">位置描述</label>
                    <div class="layui-input-block">
                        <input type="text" name="location" lay-verify="address" required placeholder="请输入" autocomplete="off"
                            class="layui-input" value=${data.location}>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">所属建筑</label>
                    <div class="layui-input-block">
                        <select name="architectureId" lay-search="">
                            <option value=""></option>
                            ${architecture.map(item => {
                            // `<option value=${item.id} selected="true">${item.architectureName}</option>`
                            return `
                                    ${function () {
                                    if (item.id === data.architectureId) {
                                        return `<option selected="true" value=${item.id}>${item.architectureName}</option>`
                                    } else {
                                        return `<option value=${item.id}>${item.architectureName}</option>`
                                    }
                                }()}
                                `
                        })}
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">所属楼层</label>
                    <div class="layui-input-block">
                        <select name="floor" lay-search="">
                            <option value=""></option>
                            ${function () {
                            var fllorNum = [] //楼层
                            for (var i = -3; i <= 20; i++) {
                                fllorNum.push(i)
                            }
                            return fllorNum.map(item => {
                                return `
                                    ${function () {
                                        if (item === data.floor) {
                                            return `<option selected="true" value=${item}>${item}</option>`
                                        } else {
                                            return `<option value=${item}>${item}</option>`
                                        }
                                    }()}
                                `
                            })
                        }()
                        }
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">SIM卡号</label>
                    <div class="layui-input-block">
                        <input type="text" name="iccid" placeholder="请输入" autocomplete="off" class="layui-input" value=${data.iccid}>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">设备名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="deviceName" placeholder="请输入" autocomplete="off" class="layui-input" value=${data.deviceName}>
                    </div>
                </div>
                <div class="layui-form-item" style="display: none">
                    <div class="layui-input-block">
                        <input type="text" name="id" placeholder="请输入" autocomplete="off" class="layui-input" value=${data.id}>
                    </div>
                </div>
                <div class="layui-form-item  layui-form-item-submit">
                    <div class="layui-input-block">
                        <button type="submit" class="layui-btn" lay-submit lay-filter="update">确认</button>
                    </div>
                </div>
            </form>
            <button id="close-pop-up" class="layui-btn close-pop-up">取消</button>
        `
                    )
                    form.render();
                    $("#tySign").mouseover(function () {
                        layer.tips('如果类型选择错误，请联系管理员修改。', '#tySign');
                    }).mouseleave(function(){
                        layer.closeAll('tips'); //关闭所有的tips层
                    })
                    //关闭弹层
                    $(".close-pop-up").click(function () {
                        layer.closeAll();
                    })
                    //验证
                    form.verify({  
                        imei: [  
                        /^[\S]{15,15}$/  
                        ,'IEMI必须是15位数字'  
                        ],  
                        address: function(value){  
                        if(value.length < 5){  
                        return '地址不够详细，至少得6个字';  
                        }  
                        }  
                        }); 
                }
            });
        }
        
        obj.event.stoppropagation();
    });


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
        url: baseUrl + "/device/tablelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        where: {
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
                    field: 'type',
                    title: '设备状态',
                    align: "center",
                    width: 90,
                    templet: "#sexTpl"
                },
                {
                    field: 'imei',
                    align: "center",
                    title: '设备编号'
                },
                {
                    field: 'type',
                    title: '设备类型',
                    align: "center",
                    templet: "#typeSign"
                },
                {
                    field: 'location',
                    align: "center",
                    title: '设备安装地点'
                },
                {
                    field: 'installationTime',
                    align: "center",
                    title: '设备安装时间'
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

    //新增设备提交
    form.on('submit(demo1)', function (data) {

        console.log(Object.keys(data.field).length)
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
                if (res.code === 200) {
                    layer.msg('新增设备成功', {
                        skin: 'layui-layer-yingke'
                        , closeBtn: 0
                        // ,anim: 4 //动画类型
                    },function (index, layero) {
                        layer.closeAll();
                    });
                } else if (res.code === 500) {
                    layer.msg(res.msg, {
                        skin: 'layui-layer-yingke'
                        , closeBtn: 0
                        // ,anim: 4 //动画类型
                    },function (index, layero) {
                        layer.closeAll();
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
                    }
                });
                if (res.code === 200) {
                    layer.msg('修改设备成功',{
                        skin: 'layui-layer-yingke'
                        , closeBtn: 0
                        // ,anim: 4 //动画类型
                    },
                    function (index, layero) {
                        layer.closeAll();
                    });
                } else {
                    layer.msg(res.msg, {
                        skin: 'layui-layer-yingke'
                        , closeBtn: 0
                        // ,anim: 4 //动画类型
                        
                    },
                    function (index, layero) {
                        layer.closeAll();
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
        skin: 'layui-layer-yingke' //英科专用弹窗样式
    });

})