import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer', 'table', 'form', 'laydate', 'tree'], function () {
    var $ = layui.jquery
    var element = layui.element;
    var table = layui.table;
    var form = layui.form
    var laydate = layui.laydate;
    var tree = layui.tree


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
                        id: item.id,
                        spread: true,
                        children: item.inspectTypeVOS.map(i => {
                        return {
                                title: i.type,
                                id: i.id,
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
    
    var title = null;
    //树形结构
    tree.render({
        elem: '#zreeList'
        , data: treeData
        , showLine: false  //是否开启连接线
        , click: function (obj) {
            //节点高亮
            var nodes = document.getElementsByClassName("layui-tree-txt");
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].innerHTML === obj.data.title)
				{
					nodes[i].style.color = "red";
					nodes[i].style.fontWeight="Bold";
				}
           
                else
				{
					nodes[i].style.color = "#a3c1b0";
					nodes[i].style.fontWeight="normal";
				}
                    
            }
            title = obj.data.title;
            table.reload('tableReload', {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    inspectType: title
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




    


    //表格处理
    table.on('tool(tableTest)', function (obj) {
        var data = obj.data;
        //表格处理
        if (obj.event === 'dispose') {
            layer.open({
                type: 1,
                offset: '180px',
                title: '处理设备',
                skin: 'layui-layer-yingke',
                area: '700px',
                content: $(".dialog"),
                success: function () {
                    $(".dialog").html(`<form class="layui-form" action="">
                    <div class="layui-form-item" style="display: none">
                        <label class="layui-form-label">id</label>
                        <div class="layui-input-block">
                            <input type="text" name="id" lay-verify="imei" required disabled placeholder="请输入" autocomplete="off"
                            class="layui-input" value=${data.id}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">处理人</label>
                        <div class="layui-input-block">
                            <input type="text" name="disposePerson" lay-verify="imei" required placeholder="请输入" autocomplete="off"
                            class="layui-input"
                        </div>
                    </div>
                    <div class="layui-form-item" style="width: 100%; margin-top: 20px">
                        <label class="layui-form-label">处理意见</label>
                        <div class="layui-input-block">
                            <textarea style="height: 80px; width: 91%" name="disposeOpinion" placeholder="请输入" autocomplete="off" class="layui-input" value=${data.deviceName}></textarea>
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
        }
    });

    //处理信息提交
  form.on('submit(update)', function (data) {

    for (var i = 0; i < Object.keys(data.field).length; i++) {
      if (data.field[Object.keys(data.field)[i]].length === 0) {
        delete data.field[Object.keys(data.field)[i]]
      }
    }

    $.ajax({
      url: baseUrl + "/inspectrecort/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
      data: data.field,
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
          layer.msg('提交成功^_^', {
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



    var exportData = []
    var tableE = table.render({
        elem: '#home',
        id: 'tableReload',
        height: 780,
        url: baseUrl + "/inspectrecort/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
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
                    field: 'dangerDetails',
                    align: "center",
                    title: '隐患描述'
                },
                {
                    field: 'inspectType',
                    align: "center",
                    title: '巡检类型',
                },
                {
                    field: 'locationDesc',
                    align: "center",
                    title: '巡检点位置',
                },
                {
                    field: 'nfcid',
                    align: "center",
                    title: 'NFC卡号',
                },
                {
                    field: 'reportPerson',
                    align: "center",
                    title: '巡检人',
                },
                {
                    field: 'reportTime',
                    align: "center",
                    title: '巡检时间',
                },
                {
                    field: 'state',
                    align: "center",
                    title: '巡检状态',
                    templet: "#typeSign"
                },
                {
                    fixed: 'right',
                    title: '操作',
                    align: "center",
                    toolbar: '#barDemo',
                    width: 150
                }
            ]
        ],
        done: function(res){
            exportData= res.data;
        }
    });

    $(".exportBtn").click(function(){
        table.exportFile(tableE.config.id,exportData, 'xls');
    })

    //监听提交搜索
    form.on('submit(submitBtn)', function (data) {

        table.reload('tableReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                locationDesc: data.field.locationDesc,
            }
        });

        return false;
    });

    //下拉搜索
    form.on('submit(submitDoubleBtn)', function (data) {
        if(data.field.companyId.length === 0){
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