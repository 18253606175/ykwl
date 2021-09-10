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


     //树形列表
  var treeData = []

  //树形结构ajax
  $.ajax({
      url: baseUrl + '/company/tree?token=' + JSON.parse(localStorage.getItem("loginInfo")).token,
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
        const { rows } = res
        if(rows[0].parentId === 0){
            for(var i in rows){     // pId为0时表示为根节点
                if(rows[i].parentId=='0'){   
                    var tempObject={};
                    tempObject.title=rows[i].title;
                    tempObject.id=rows[i].id;
                    tempObject.spread = true;
                    tempObject.children=getChildren(tempObject.id);
                    treeData.push(tempObject);
                }
              }
        } else {
            for(var i in rows){     // pId为0时表示为根节点
                if(rows[i].parentId === rows[0].parentId){   
                    var tempObject={};
                    tempObject.title=rows[i].title;
                    tempObject.id=rows[i].id;
                    tempObject.spread = true;
                    tempObject.children=getChildren(tempObject.id);
                    treeData.push(tempObject);
                }
              }
        }
        function getChildren(id){    //递归体  即对每条data逐条递归找children
            var tempArray=[];
            for(var i in rows){
                if(rows[i].parentId==id){
                    var tempChild={};
                    tempChild.title=rows[i].title;
                    tempChild.id=rows[i].id;
                    if(selectChildren(rows[i].id)){   //若存在子节点，继续递归；否则为叶节点，停止递归
                        tempChild.children=getChildren(rows[i].id);
                    }
                    tempArray.push(tempChild);
                }
            }
            return tempArray;
        }
        function selectChildren(id){   // 是否存在子节点
            for(var i in rows){
                if(rows[i].parentId==id){
                    return true;
                }
            }
            return false;
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
  
  var id = 0;
  //树形结构
  tree.render({
      elem: '#zreeList'
      , data: treeData
      , showLine: true  //是否开启连接线
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
          id = obj.data.id;
          table.reload('tableReload', {
              page: {
                  curr: 1 //重新从第 1 页开始
              },
              where: {
                companyId: id,
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

    //编辑  删除设备
    table.on('tool(tableTest)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('您确定要删除吗？', {
                skin: 'layui-layer-yingke',
                btn: ['确定','取消'] //按钮
              }, function(){
                $.ajax({
                    url: baseUrl + "/inspectadd/delete?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
                    contentType: "application/json",
                    data: JSON.stringify({
                        id: data.id,
                    }),
                    type: 'post',
                    // dataType: "json",
                    success: function (res) {
                        if(res.code === 20001){
                            layer.alert('登录已过期请重新登陆', {
                                skin: 'layui-layer-yingke' //样式类名
                                ,closeBtn: 0
                                }, function(){
                                    parent.location.href = './index.html'
                                });
                        } 
                        else if (res.code === 200) {
                            obj.del();
                            layer.msg('删除成功', {
                                icon: 1,
                                closeBtn: 0,
                                anim: 0, //动画类型
                                time: 3000
                            });

                        } else {
                            layer.msg(res.msg, {
                                icon: 1,
                                closeBtn: 0,
                                anim: 6, //动画类型
                                time: 4000

                            });
                        }
                    }
                })
              }, function(){
                
              });
        } else if (obj.event === 'edit') {
            layer.open({
                type: 1,
                offset: '180px',
                title: '编辑设备',
                skin: 'layui-layer-yingke',
                area: ['600px', '520px'],
                content: $(".dialog"),
                success: function (layero, index) {
                    $(".dialog").html(
                        `
                    <form class="layui-form" action="">
                        <div class="layui-form-item">
                            <label class="layui-form-label">所属单位</label>
                            <div class="layui-input-block  layui-required">
                                <select name="companyId" lay-filter="companyId-select1" lay-verify="required" lay-search="">
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
                        <div class="layui-form-item" style="display: none">
                            <label class="layui-form-label">id</label>
                            <div class="layui-input-block">
                                <input type="text" name="id" placeholder="请输入" autocomplete="off"
                                class="layui-input" value=${data.id}>
                            </div>
                        </div>
						<div class="layui-form-item">
                            <label class="layui-form-label">巡检类型</label>
                            <div class="layui-input-block">
                                <ul id="selTree1" class="dtree" data-id="0" ></ul>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">NFC卡号</label>
                            <div class="layui-input-block">
                                <input type="text" name="nfcid" disabled placeholder="请输入" autocomplete="off"
                                class="layui-input" value=${data.nfcid}>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">所属建筑</label>
                            <div class="layui-input-block">
                                <select name="architectureId" id="architectureId-select1" lay-search="">
                                    <option value=""></option>
                                    ${
                                        function () {
                                            let mapData = null
                                        let url = baseUrl + "/architecture/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token + "&companyId=" + data.companyId;
                                        $.ajax({
                                            url: url,
                                            async: false,
                                            success: function(res){
                                                if(res.code === 20001){
                                                    layer.alert('登录已过期请重新登陆', {
                                                        skin: 'layui-layer-yingke' //样式类名
                                                        ,closeBtn: 0
                                                        }, function(){
                                                            parent.location.href = './index.html'
                                                        });
                                                } 
                                                else if(res.code === 200){
                                                    mapData =  res.rows.map(item => {
                                                        return `
                                                        ${function () {
                                                            if (item.id === data.architectureId) {
                                                                return `<option selected="true" value=${item.id}>${item.architectureName}</option>`
                                                            } else {
                                                                return `<option value=${item.id}>${item.architectureName}</option>`
                                                            }
                                                        }()}
                                                                    `
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
                                    return mapData.join("")
                                }()
                            }
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">楼层</label>
                            <div class="layui-input-block">
                                <input type="text" name="floor" placeholder="请输入" autocomplete="off"
                                class="layui-input" value=${data.floor}>
                            </div>
                        </div>
                        
                        <div class="layui-form-item">
                            <label class="layui-form-label">巡检点位置</label>
                            <div class="layui-input-block">
                                <input type="text" name="locationDesc" lay-verify="required" placeholder="请输入" autocomplete="off"
                                    class="layui-input" value=${data.locationDesc}>
                            </div>
                        </div>
                        <div class="layui-form-item  layui-form-item-submit">
                            <div class="layui-input-block" style="text-align:center; margin-left: 0;">
                                <button type="submit" class="layui-btn" lay-submit="" lay-filter="update">确认</button>
                                <button type="button" id="close-pop-up" class="layui-btn layui-btn-primary">取消</button>
                            </div>
                        </div>
                    </form>
            
        `
                    )
                    form.render();
                    //关闭弹层
                    $("#close-pop-up").click(function () {
                        layer.closeAll();
                    })

                    dtree.render({
                        elem: "#selTree1",
                        width: "100%", // 指定树的宽度
                        data: treeData,
                        select: true,
						line:true,
                        selectInitVal: data.smallTypeNumber,
                        selectInputName: {
                            nodeId: "smallTypeNumber",
                            context: "inspectType",
                            parentId: "bigTypeNumber",
                        }
                    });
                }
            });
        }
    })
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
                    field: 'id',
                    align: "center",
                    title: '巡检点编号'
                },
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


    //添加
    $(".addBtn").click(function(){
        layer.open({
            type: 1,
            offset: '180px',
            title: '添加巡检点',
            skin: 'layui-layer-yingke',
            area: ['600px', '520px'],
            content: $(".dialog"),
            success: function (layero, index) {
                $(".dialog").html(
                    `
                <form class="layui-form" action="">
                    <div class="layui-form-item">
                        <label class="layui-form-label">所属单位</label>
                        <div class="layui-input-block  layui-required">
                            <select name="companyId" lay-filter="companyId-select" lay-verify="required" lay-search="">
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
                        <label class="layui-form-label">巡检类型</label>
                        <div class="layui-input-block">
                            <ul id="selTree1" class="dtree" data-id="0" ></ul>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">NFC卡号</label>
                        <div class="layui-input-block">
                            <input type="text" name="nfcid" lay-verify="required" placeholder="请输入" autocomplete="off"
                            class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">所属建筑</label>
                        <div class="layui-input-block">
                            <select name="architectureId" id="architectureId-select" lay-search="" lay-filter="buildingFilter">
                            <option value="">请选择单位</option>
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
                        <label class="layui-form-label">巡检点位置</label>
                        <div class="layui-input-block">
                            <input type="text" lay-verify="required" name="locationDesc" placeholder="请输入" autocomplete="off"
                                class="layui-input" >
                        </div>
                    </div>
                    <div class="layui-form-item  layui-form-item-submit">
                        <div class="layui-input-block" style="text-align:center; margin-left: 0;">
                            <button type="submit" class="layui-btn" lay-submit="" lay-filter="save">确认</button>
                            <button type="button" id="close-pop-up" class="layui-btn layui-btn-primary">取消</button>
                        </div>
                    </div>
                </form>
        
    `
                )
                form.render();
                //关闭弹层
                $("#close-pop-up").click(function () {
                    layer.closeAll();
                })

                dtree.render({
                    elem: "#selTree1",
                    width: "100%", // 指定树的宽度
                    data: treeData,
                    select: true,
					line:true,
                    selectInputName: {
                        nodeId: "smallTypeNumber",
                        context: "inspectType",
                        parentId: "bigTypeNumber",
                    }
                });

            }
        });
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
                locationDesc: data.field.locationDesc
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
                    companyId: data.field.companyId
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