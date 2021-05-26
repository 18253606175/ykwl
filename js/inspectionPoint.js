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
    function flowReload(param, parentParam, location, companyId, reptime) {


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
                        reptime: reptime
                    },
                    success: function (res) {
                        $(".title").append(`<p class="count">共: ${res.rows.total}个巡检点</p>`)
                        if (res.rows.rows.length === 0) {
                            $(".layui-flow-more").css('display', 'none')
                            $("#flow_inspectList").html('<p id="empty" style="color:#fff">无数据</p>')
                        } else {
                            layui.each(res.rows.rows, function (index, item) {
                                //这里遍历数据
                                lis.push(
                                    `
                                        <div class="pollingCard" index=${item}>
                                            <div>
                        
                                            </div>
                                            <section>${item.inspectType}</section>
                                            <aside>
                                                <article>${item.status === 2 ? '<span class="layui-badge layui-bg-green">已巡检</span>' : '<span class="layui-badge layui-bg-red">未巡检</span>'}</article>
                                                <p>NFC卡号: ${item.nfcid}</p>
                                                <p class="location">位置: ${item.locationDesc}</p>
                                                <p>巡检时间：${item.reptime ? item.reptime : '--'}</p>
                                            </aside>
                                        </div> 
                                    `
                                );
                            });
                        }

                        next(lis.join(''), page < res.rows.pageCount);
                        $("#empty").remove();


                        for (var i = 0; i < document.getElementsByClassName("pollingCard").length; i++) {
                            $(".pollingCard")[i].onclick = function () {
                                layer.open({
                                    type: 1,
                                    offset: '180px',
                                    title: '编辑设备',
                                    skin: 'layui-layer-yingke',
                                    area: ['800px', '500px'],
                                    content: $(".dialog-card"),
                                    success: function (layero, index) {


                                        //表格
                                        table.render({
                                            elem: '#home',
                                            id: 'tableReload',
                                            height: 300,
                                            data:[{
                                                id: 1,
                                                companyPId: 2
                                            }],
                                            limit: 15,
                                            limits: [15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 500],
                                            cellMinWidth: 85,
                                            cols: [
                                                [{
                                                        field: 'id',
                                                        align: "center",
                                                        title: '公司ID'
                                                    }, {
                                                        field: 'companyPId',
                                                        align: "center",
                                                        title: '运营商ID'
                                                    }, {
                                                        field: 'comID',
                                                        align: "center",
                                                        title: '消防平台ID'
                                                    }, {
                                                        field: 'companyName',
                                                        align: "center",
                                                        title: '公司名称'
                                                    }, {
                                                        field: 'companyAddress',
                                                        align: "center",
                                                        title: '单位地址'
                                                    }, {
                                                        field: 'companyType',
                                                        align: "center",
                                                        title: '单位类别'
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
                    }
                })

            }
        });
    }

    flowReload();

    //点击弹出详情  ajax回调
    $.ajax({
        url: baseUrl + "/inspectadd/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        data: {
            id: 1700
        },
        success: function (res) {
            console.log(res)
        }
    })



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
            if (Number(this.getAttribute("index")) === 0) {
                state = '1'
            }
            if (Number(this.getAttribute("index")) === 1) {
                state = '2'
            }
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
                            inspectType: title,
                            status: state
                        },
                        success: function (res) {
                            if (res.rows.rows.length === 0) {
                                $(".layui-flow-more").css('display', 'none')
                                $("#flow_inspectList").html('<p id="empty" style="color:#fff">无数据</p>')
                            } else {
                                layui.each(res.rows.rows, function (index, item) {
                                    //这里遍历数据
                                    lis.push(
                                        `
                                                <div>
                                                    <div>
                                
                                                    </div>
                                                    <section>${item.inspectType}</section>
                                                    <aside>
                                                        <article>${item.status === 2 ? '<span class="layui-badge layui-bg-green">已巡检</span>' : '<span class="layui-badge layui-bg-red">未巡检</span>'}</article>
                                                        <p>NFC卡号: ${item.nfcid}</p>
                                                        <p class="location">位置: ${item.locationDesc}</p>
                                                        <p>巡检时间：${item.reptime ? item.reptime : '--'}</p>
                                                    </aside>
                                                </div> 
                                            `
                                    );
                                });
                            }

                            next(lis.join(''), page < res.rows.pageCount);
                            $("#empty").remove();
                        }
                    })

                }
            });
        }
    }

    if ($(".location").height() > 40) {
        $(".location").css("overflow", "hidden")
    }

    //监听提交搜索
    form.on('submit(submitBtn)', function (data) {
        flowReload(id, pid, data.field.locationDesc)
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
            flowReload(id, pid, data.field.locationDesc, data.field.companyId)
        }

        return false;
    });

    form.on('submit(dateSubmitBtn)', function (data) {
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