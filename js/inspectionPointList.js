import {
    baseUrl
} from '../js/params.js'
layui.config({
    base: "../js/"
}).extend({
    dtree: "dtree"
});
layui.use(['element', 'layer', 'table', 'form', 'laydate', 'tree', 'dtree'], function () {
    var dtree = layui.dtree;
    var $ = layui.jquery
    var element = layui.element;
    var table = layui.table;
    var form = layui.form
    var laydate = layui.laydate;
    var tree = layui.tree

    var architecture = [] //建筑
    var fllorNum = [] //楼层
    var treeData = []
    for (var i = -3; i <= 20; i++) {
        fllorNum.push(i)
    }
    //所属建筑
    $.ajax({
        url: baseUrl + "/architecture/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token,
        async: false,
        success: function (res) {
            architecture = res.rows

        }
    })


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

    var id = null;
    var pid = null;
    //树形结构
    tree.render({
        elem: '#zreeList'
        , data: treeData
        , showLine: true  //是否开启连接线
        , click: function (obj) {
            //节点高亮
            var nodes = document.getElementsByClassName("layui-tree-txt");
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].innerHTML === obj.data.title) {
                    nodes[i].style.color = "red";
                    nodes[i].style.fontWeight = "Bold";
                }

                else {
                    nodes[i].style.color = "#a3c1b0";
                    nodes[i].style.fontWeight = "normal";
                }

            }
            id = obj.data.id
            pid = obj.data.parentId
            table.reload('tableReload', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    smallTypeNumber: id,
                    bigTypeNumber: pid,
                }
            });
        }
    })

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


    //处理信息提交
    form.on('submit(update)', function (data) {

        for (var i = 0; i < Object.keys(data.field).length; i++) {
            if (data.field[Object.keys(data.field)[i]].length === 0) {
                delete data.field[Object.keys(data.field)[i]]
            }
            if (Object.keys(data.field)[i] === 'selTree1_select_input') {
                delete data.field[Object.keys(data.field)[i]]
            }
            if (Object.keys(data.field)[i] === 'nfcid') {
                delete data.field[Object.keys(data.field)[i]]
            }
        }

        $.ajax({
            url: baseUrl + "/inspectadd/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify(data.field),
            contentType: "json/application",
            type: 'post',
            dataType: "json",
            success: function (res) {
                table.reload('tableReload', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    },

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
                    layer.msg('编辑成功^_^', {
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

   
    // data.inspectType

    //添加巡检点
    form.on('submit(save)', function (data) {
        $.ajax({
            url: baseUrl + "/inspectadd/save?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify(data.field),
            contentType: "json/application",
            type: 'post',
            dataType: "json",
            success: function (res) {
                table.reload('tableReload', {
                    page: {
                        curr: 1 //重新从第 1 页开始
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
                    layer.msg('巡检点添加成功',{
							icon: 1,
							closeBtn: 0,
							shade: 0.5,
							shadeClose:true,
                            anim: 0, //动画类型
                            time: 2000
					}, function(){
							layer.closeAll();
						});
                } else{
                    layer.msg(res.msg,{
							icon: 5,
							closeBtn: 0,
							anim: 6, //动画类型
						   time: 3000
						});
                }
            }
        })
        return false;
    });




        var exportData = []
        var tableE = table.render({
        elem: '#home',
        id: 'tableReload',
        height: 750,
        url: baseUrl + "/inspectadd/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        limits: [15, 20, 30,40,50,100,200,500],
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
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "code": 0, //解析接口状态
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
                    field: 'nfcid',
                    align: "center",
                    title: 'NFC卡号',
					width:160
                },
                {
                    field: 'inspectType',
                    align: "center",
                    title: '巡检类型',
					sort:true,
					width:160
					
                },
				{
                    field: 'companyName',
                    align: "center",
                    title: '巡检点所属单位',
                },
                {
                    field: 'locationDesc',
                    align: "center",
                    title: '巡检点位置',
                },
                {
                    field: 'createTime',
                    align: "center",
                    title: '创建时间',
					width: 120,
					sort:true
                },
				 {
                    field: 'toxfTime',
                    align: "center",
                    title: '上传消防时间',
					width: 150,
					sort:true
                },
				{
                    field: 'reptime',
                    align: "center",
                    title: '最近巡检时间',
					width: 140,
					sort:true
                }
            ]
        ],
        done: function(res){
            $(".count").html(`共: ${res.count}个巡检点`)
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
        table.exportFile(tableE.config.id,exportData, 'xls', '巡检点列表');
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


    //监听提交搜索
    form.on('submit(submitBtn)', function (data) {

        table.reload('tableReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                locationDesc: data.field.locationDesc,
                smallTypeNumber: id,
                bigTypeNumber: pid,
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
                    smallTypeNumber: id,
                    bigTypeNumber: pid,
                }
            });
        }

        return false;
    });




    //弹窗样式
    layer.config({
        //anim: 2, //出场动画
        extend: 'layskin/style.css',
        // skin: 'layui-layer-yingke' //英科专用弹窗样式
    });

})