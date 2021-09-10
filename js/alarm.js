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
    var selectDate = [{
        title: "没有选项",
        value: ""
    }]

    var selectList = []
    var tableData = []
    var fllorNum = [] //楼层
    for (var i = -3; i <= 20; i++) {
        fllorNum.push(i)
    }

    

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
           if(res.code === 200){
                const {
                    company
                } = res.rows
                if(res.code)
                titleBottom = company

                titleContent.company = JSON.parse(localStorage.getItem("loginInfo")).companyName
                titleContent.user = JSON.parse(localStorage.getItem("loginInfo")).phone
                titleContent.address = company.companyAdress
           } else if(res.code === 20001){
                layer.alert('登录已过期请重新登陆', {
                    skin: 'layui-layer-yingke' //样式类名
                    ,closeBtn: 0
                    }, function(){
                        parent.location.href = './index.html'
                    });
            } else {
                layer.msg(res.msg, {
                    icon: 1,
                    closeBtn: 0,
                    anim: 6, //动画类型
                    time: 3000
                });
            }
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
           if(res.code === 200){
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
           }else if(res.code === 20001){
                layer.alert('登录已过期请重新登陆', {
                    skin: 'layui-layer-yingke' //样式类名
                    ,closeBtn: 0
                    }, function(){
                        parent.location.href = './index.html'
                    });
            } else {
                layer.msg(res.msg, {
                    icon: 1,
                    closeBtn: 0,
                    anim: 6, //动画类型
                    time: 3000
                });
            }
        }
    })



    $(".Realtime-left-top-content").append($p);



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


    //表格处理
    table.on('tool(tableTest)', function (obj) {
        var data = obj.data;
        //表格处理
        if (obj.event === 'dispose') {
            layer.open({
                type: 1,
                offset: '180px',
                title: '报警处理',
                skin: 'layui-layer-yingke',
                area: '900px',
                content: $(".dialog"),
                success: function () {
                    $(".dialog").html(`<form class="layui-form" action="">
                    <div class="layui-form-item">
                        <label class="layui-form-label">上报时间</label>
                        <div class="layui-input-block">
                            <input type="text" name="imei" lay-verify="imei" required disabled placeholder="请输入" autocomplete="off"
                            class="layui-input" value=${data.alarmTime}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">报警类别</label>
                        <div class="layui-input-block">
                            <input type="text" name="imei" lay-verify="imei" required disabled placeholder="请输入" autocomplete="off"
                            class="layui-input" value=${data.alarmMessage}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">上报方式</label>
                        <div id="tySign"  class="layui-input-block">
                            <input type="text" name="imei" lay-verify="imei" required disabled placeholder="请输入" autocomplete="off"
                            class="layui-input" value="自动上报">
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">设备位置</label>
                        <div class="layui-input-block">
                            <input type="text" name="imei" lay-verify="imei" required disabled placeholder="请输入" autocomplete="off"
                                class="layui-input" value=${data.location}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">设备编号</label>
                        <div class="layui-input-block">
                            <input type="text" name="location" lay-verify="address" disabled required placeholder="请输入" autocomplete="off"
                                class="layui-input" value=${data.imei}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">处理状态</label>
                        <div class="layui-input-block">
                            <input type="text" name="imei" lay-verify="imei" required disabled placeholder="请输入" autocomplete="off"
                            class="layui-input" value=${function(){
                                if(data.isSolve === 1){
                                    return `未处理`
                                }else if(data.isSolve === 2){
                                    return `
                        已处理 `
                                }
                            }()}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">处理方式</label>
                        <div class="layui-input-block radioGroup">
                            <input type="radio" name="dispose_type" value="1"  title="正常报警" checked="">
                            <input type="radio" name="dispose_type" value="2" title="误报" >
                            <input type="radio" name="dispose_type" value="3" title="模拟报警" >
                        </div>
                    </div>
                    <div class="layui-form-item" style="width: 100%">
                        <label class="layui-form-label">处理意见</label>
                        <div class="layui-input-block">
                            <textarea style="height: 80px" name="dispose_method" placeholder="请输入" autocomplete="off" class="layui-input" value=${data.deviceName}></textarea>
                        </div>
                    </div>
                    <div class="layui-form-item" style="display: none">
                        <div class="layui-input-block">
                            <input type="text" name="id" placeholder="请输入" autocomplete="off" class="layui-input" value=${data.id}>
                        </div>
                    </div>
                    <div class="layui-form-item  layui-form-item-submit">
                        <div style="text-align: center;">
                            <button type="submit" class="layui-btn" lay-submit lay-filter="update">确认</button>
                            <button type="button" id="close-pop-up" class="layui-btn layui-btn-primary">取消</button>
                        </div>
                    </div>
                </form>`)
				form.render();
                $("#close-pop-up").click(function(){
                    layer.closeAll();
                })
                }
            });
        } else if(obj.event === 'check'){
            $.ajax({
                url: baseUrl + "/disposesuggest/info?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
                data: {
                    alarmType: data.alarmType
                },
                success: function(res){
                    layer.alert(res.rows !== null ? res.rows.alarmExamine :'此类问题请联系英科客服。<br/>联系电话: 05367716889', {
                        offset: '200px',
                        skin: 'layui-layer-yingke',
                        area: '500px',
                        title: `${data.alarmMessage}的处理建议`
                    });
                }
            })
          }
    });

    //筛选
    // $(".wisdom-electricity-bottom-top-classify").append(
    //     `
    //     <p class="classifyStyle typeScreen"><span style="background: #1191da;"></span>全部</p>
    //     <p class="typeScreen"><span style="background: #c82c1f"></span> 报警</p> 
    //     <p class="typeScreen"><span style="background: #bf671d"></span> 故障</p> 
    //     `
    // )

    // $(".wisdom-electricity-bottom-top-classify > p").on("click", function () {
    //     $(this).addClass("classifyStyle");
    //     $(this).siblings('p').removeClass('classifyStyle');
    // });

    var typeId = null;
    var state = 0;

    

    var exportData = []
    var tableE = table.render({
        elem: '#home',
        id: 'tableReload',
        height: 750,
        url: baseUrl + "/alarm/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        limits: [15, 30, 45],
        cellMinWidth: 85,
        page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档  
            groups: 5 //只显示 1 个连续页码
                ,
                first: "首页" //不显示首页
                ,
            last: "尾页" //不显示尾页
        },
        even: true,
        limit: 15,
        skin: 'row',
        where: {
            companyId: localStorage.getItem('companyId'),
            location: sessionStorage.getItem('location')
        },
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "code": 0, //解析接口状态
                "data": function(){
                    res.rows.rows.map(item=>{
                        item.alarmData = item.alarmData + "" + item.data_unit
                    })
                    return res.rows.rows
                }(), //解析数据列表
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
                    field: 'alarmMessage',
                    title: '报警类别',
                    align: "center",
					width: 120,
                    event: 'setSign',
					sort: true
                },
                {
                    field: 'imei',
                    align: "center",
                    title: '设备编号',
					sort: true,
					width: 150,
                },
                {
                    field: 'type_sign',
                    title: '设备类型',
                    align: "center",
					width: 120,
                    templet: "#typeSign",
					sort: true
                },
				{
                    field: 'companyName',
                    title: '单位名称',
                    align: "center",
					sort: true
                },
                {
                    field: 'location',
                    align: "center",
                    width: 230,
                    title: '设备报警地点',
					sort: true
                },
                {
                    field: 'alarmTime',
                    align: "center",
                    title: '设备报警时间',
					sort: true,
					width: 160,
                },
                {
                    field: 'alarmData',
                    align: "center",
                    title: '报警值',
					width: 100,
					sort: true
                },
                {
                    field: 'isSolve',
                    align: "center",
                    title: '处理状态',
                    templet: "#isSolve",
					width: 90,
					
                },
                {
                    fixed: 'right',
                    title: '处理建议',
                    align: "center",
                    toolbar: '#look',
					width: 90,
                },
                {
                    fixed: 'right',
                    title: '操作',
                    align: "center",
                    toolbar: '#barDemo',
					width: 80,
                }
            ]
        ],
        done: function(res){
            exportData= res.data;
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
    $(".exportButton").click(function(){
        table.exportFile(tableE.config.id,exportData, 'xls', '报警列表' );
    })

table.on('rowDouble(tableTest)',function(obj){
        let data = obj.data;
            layer.open({
                type: 2,
                id: "iframe",
                skin: 'layui-layer-yingke',
                title: false,
                closeBtn: 0, //不显示关闭按钮
                title: '报警详情',
                shade: [0],
                scrollbar: true,
                closeBtn: 1,
				offset:50,
                area: ['70%', '81%'],
                shadeClose: true,
                anim: 0,
                content: [`../demo.html?id=${data.ykDeviceId}`, 'no'], //iframe的url，no代表不显示滚动条
            });
    })
     //左侧分类
     $.ajax({
        url :baseUrl + '/alarm/alarmnumgroupbytype?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
        async: false,
        success: function(res){
            if(res.code === 200){
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
                            <li class="layui-nav-item select-li" id=${item.type}><a href="javaScript:;">${item.name}<blockquote class="layui-elem-quote layui-quote-nm"><span class="layui-badge">${typeCount[index]}</span></blockquote> </a></li>
                        `
    
                })
                $(".Realtime-left-bottom > .layui-nav").append(leftTypeDate.join(''));
            }else if(res.code === 20001){
                layer.alert('登录已过期请重新登陆', {
                    skin: 'layui-layer-yingke' //样式类名
                    ,closeBtn: 0
                    }, function(){
                        parent.location.href = './index.html'
                    });
            } else {
                layer.msg(res.msg, {
                    icon: 1,
                    closeBtn: 0,
                    anim: 6, //动画类型
                    time: 3000
                });
            }
        }
    })


    //初始化渲染全部类型
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
                    type: state,
                    alarmType: typeId
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
                    if (Number(this.getAttribute("index")) === 1) {
                        state = '1'
                    }
                    if (Number(this.getAttribute("index")) === 2) {
                        state = '2'
                    }
                   
        
                    table.reload('tableReload', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        },
                        where: {
                            type: state,
                            alarmType: typeId
                        }
                    });
        
        
                }
            }
            $(".select-li").on('click', function () {
                $(this).addClass("layui-this");
                $(this).siblings('li').removeClass('layui-this');
            });
        }


    }



    
    //监听提交搜索
    form.on('submit(submitBtn)', function (data) {

        table.reload('tableReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                location: data.field.location,
                alarmType: typeId,
                type: state
            }
        });

        return false;
    });

    //下拉搜索
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
                    alarmType: typeId,
                    type: state
                }
            });
        }

        return false;
    });

   

    $(".wisdom-electricity-bottom-top-type > span").on("click", function () {
        $(this).addClass("classifyStyle");
        $(this).siblings('span').removeClass('classifyStyle');
    });

    
    
    //报警处理提交
    form.on('submit(update)', function (data) {
        $.ajax({
            url: baseUrl + "/alarm/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify({
                id: Number(data.field.id),
                dispose_type: Number(data.field.dispose_type),
                dispose_method: data.field.dispose_method
            }),
            contentType: "json/application",
            type: 'post',
            dataType: "json",
            success: function (res) {
                table.reload('tableReload', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    }
                });
                if (res.code === 200) {
                    layer.msg('报警处理成功^_^', {
                        icon: 1,
                        shade: 1,
                        closeBtn: 0,
                        anim: 0, //动画类型
                        time: 2000
                    }, function () {
                        layer.closeAll();
                    });
                } else if(res.code === 20001){
                    layer.alert('登录已过期请重新登陆', {
                        skin: 'layui-layer-yingke' //样式类名
                        ,closeBtn: 0
                        }, function(){
                            parent.location.href = './index.html'
                        });
                } else {
                    layer.msg(res.msg, {
                        icon: 1,
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
        // skin: 'layui-layer-yingke' //英科专用弹窗样式
    });

})