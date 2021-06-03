import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer', 'flow', 'tree', 'laydate', 'table'], function () {
    var flow = layui.flow;
    var form = layui.form
    var $ = layui.jquery
    var tree = layui.tree
    var laydate = layui.laydate;
    var table = layui.table;

    //下拉框value
    var selectDate = [{
        title: "请选择单位",
        value: ""
    }]

    var selectList = []

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

    //日期
    laydate.render({
        elem: '#date'
    });


    var treeData = []

    //树形结构ajax
    $.ajax({
        url: baseUrl + '/inspecttype/listbypnumber?token=' + JSON.parse(localStorage.getItem("loginInfo")).token,
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
                treeData = res.rows.map(item => {
                    return {
                        title: item.type,
                        id: item.number,
                        spread: true,
                        children: item.inspectTypeVOS.map(i => {
                            return {
                                title: i.type,
                                id: i.number,
                                parentId: i.pNumber,
                                spread: true
                            }
                        })
                    }
                })
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

    //树形结构
    var id = null;
    var pid = null;
    tree.render({
        elem: '#zreeList',
        data: treeData,
        showLine: true //是否开启连接线
        ,
        click: function (obj) {
            $("#flow_inspectList").html('')
            //节点高亮
            var nodes = document.getElementsByClassName("layui-tree-txt");
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].innerHTML === obj.data.title) {
                    nodes[i].style.color = "red";
                    nodes[i].style.fontWeight = "Bold";
                } else {
                    nodes[i].style.color = "#a3c1b0";
                    nodes[i].style.fontWeight = "normal";
                }

            }
            id = obj.data.id
            pid = obj.data.parentId
            flowReload(id, pid)
        }
    })

    //流加载请求列表数据
    function flowReload(param, parentParam, location, companyId, reptime, state) {


        flow.load({
            elem: '#flow_inspectList' //流加载容器
            ,
            scrollElem: '#flow_inspectList' //滚动条所在元素，一般不用填，此处只是演示需要。
            ,
            done: function (page, next) { //执行下一页的回调
                var lis = [];
                //模拟数据插入
                $.ajax({
                    url: baseUrl + "/inspectadd/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
                    async: false,
                    md: 100,
                    data: {
                        pageNumber: page,
                        pageSize: 20,
                        smallTypeNumber: param,
                        bigTypeNumber: parentParam,
                        locationDesc: location,
                        companyId: companyId,
                        reportTime: reptime,
                        status: state
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
                            
                        $(".count").html(`共: ${res.rows.total}个巡检点`)
                        if (res.rows.rows.length === 0) {
                            $(".layui-flow-more").css('display', 'none')
                            $("#flow_inspectList").html('<p id="empty" style="color:#fff">无数据</p>')
                        } else {
                            layui.each(res.rows.rows, function (index, item) {
                                //这里遍历数据
                                lis.push(
                                    `
                                        <div class="pollingCard" index=${item.nfcid}>
                                            <div style="background: ${item.status === 2 ? 'url(../img/green1.png) no-repeat center 50%;': 'url(../img/nocheck.png) no-repeat center 50%;'}">
                        
                                            </div>
                                            <section>${item.inspectType}</section>
                                            <aside>
                                                <article>${item.status === 2 ? '<span class="layui-badge layui-bg-green">已巡检</span>' : '<span class="layui-badge layui-bg-red">未巡检</span>'}</article>
                                                <p>NFC卡号: ${item.nfcid}</p>
                                                <p class="location">位置: ${item.locationDesc}</p>
                                                <p>巡检时间：${item.reportTime ? item.reportTime : '--'}</p>
                                            </aside>
                                        </div> 
                                    `
                                );
                            });
                        }

                        next(lis.join(''), page < res.rows.pageCount);
                        $("#empty").remove();
                        $(".layui-flow-more").hide();


                        for (var i = 0; i < document.getElementsByClassName("pollingCard").length; i++) {
                            $(".pollingCard")[i].onclick = function () {
                                let nfcid = $(this).attr("index")
                                //点击弹出详情  ajax回调
                                layer.open({
                                    type: 1,
                                    offset: '180px',
                                    title: '详情',
                                    skin: 'layui-layer-yingke',
                                    area: ['1000px', '550px'],
                                    content: $(".dialog-card"),
                                    success: function (layero, index) {
                                        //表格
                                        table.render({
                                            elem: '#home',
                                            id: 'tableReload',
                                            url: baseUrl + "/inspectrecort/listbyncfid?token=" + JSON.parse(localStorage.getItem('loginInfo'))
                                                .token
                                            , request: {
                                                pageName: 'pageNumber' //页码的参数名称，默认：page
                                                , limitName: 'pageSize' //每页数据量的参数名，默认：limit
                                            },
                                            height: 470,
                                            where: {
                                                nfcId: nfcid
                                            },
                                            parseData: function (response) {
                                                return {
                                                    "data": response.rows.rows,
                                                    "code": 0,
                                                    "count": response.rows.total,
                                                }
                                            }
                                            , page: true,
                                            cellMinWidth: 85,
                                            cols: [
                                                [{
                                                    field: 'nfcid',
                                                    align: "center",
                                                    title: 'NFC卡号',
                                                    width: 150
                                                }, {
                                                    field: 'inspectType',
                                                    align: "center",
                                                    title: '巡检点类型'
                                                }, {
                                                    field: 'locationDesc',
                                                    align: "center",
                                                    title: '位置描述'
                                                }, {
                                                    field: 'state',
                                                    align: "center",
                                                    title: '状态',
                                                    templet: "#typeSign"
                                                },{
                                                    field: 'reportPerson',
                                                    align: "center",
                                                    title: '巡检人'
                                                }, {
                                                    field: 'reportTime',
                                                    align: "center",
                                                    title: '巡检时间'
                                                }
                                                ]
                                            ]
                                        })


                                        form.render();
                                        //关闭弹层
                                        $("#close-pop-up").click(function () {
                                            layer.closeAll();
                                        })

                                    }
                                });

                            }
                        }
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

            }
        });
    }

    flowReload();





    //已巡检未巡检筛选

    $(".wisdom-electricity-bottom-top-classify").append(
        `
        <p class="typeScreen"><span style="background: #c82c1f"></span> 未巡检</p> 
        <p class="typeScreen"><span style="background: #bf671d"></span> 已巡检</p> 
        `
    )

    $(".wisdom-electricity-bottom-top-classify > p").on("click", function () {
        $(this).addClass("classifyStyle");
        $(this).siblings('p').removeClass('classifyStyle');
    });
    var state = 0

    //已巡检未巡检筛选
    for (var i = 0; i < document.getElementsByClassName("typeScreen").length; i++) {
        $(".typeScreen")[i].setAttribute("index", i)
        $(".typeScreen")[i].onclick = function () {
            $("#flow_inspectList").html('')
            if (Number(this.getAttribute("index")) === 0) {
                state = '1'
            }
            if (Number(this.getAttribute("index")) === 1) {
                state = '2'
            }
            flowReload(id, pid, 0, 0, 0, state)
        }
    }

    if ($(".location").height() > 40) {
        $(".location").css("overflow", "hidden")
    }

    //监听提交搜索
    form.on('submit(submitBtn)', function (data) {
        $("#flow_inspectList").html('')
        flowReload(id, pid, data.field.locationDesc)
        return false;
    });

    form.on('submit(submitDoubleBtn)', function (data) {
        $("#flow_inspectList").html('')
        if (data.field.companyId.length === 0) {
            layer.msg("请选择单位", {
                icon: 2,
                closeBtn: 0,
                anim: 6, //动画类型
                time: 3000
            });
        } else {
            flowReload(id, pid, data.field.locationDesc, data.field.companyId)
        }

        return false;
    });

    form.on('submit(dateSubmitBtn)', function (data) {
        $("#flow_inspectList").html('')
        if (data.field.reptime.length === 0) {
            layer.msg("请选择时间", {
                icon: 2,
                closeBtn: 0,
                anim: 6, //动画类型
                time: 3000
            });
        } else {
            flowReload(id, pid, data.field.locationDesc, data.field.companyId, data.field.reptime)
        }

        return false;
    });

    //弹窗样式
    layer.config({
        //anim: 2, //出场动画
        extend: 'layskin/style.css',
        //skin: 'layui-layer-yingke' //英科专用弹窗样式
    });
})