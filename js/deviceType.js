import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer', 'table', 'form', 'laydate'], function () {
    var $ = layui.jquery
    var element = layui.element;
    var table = layui.table;
    var form = layui.form
    var laydate = layui.laydate;
    var tree = layui.tree;
    var typeId = null;
    var state = 0;
    
    //平台
    var interface_information = [
        {
            title: '华为',
            value: '1'
        },
        {
            title: '电信',
            value: '2'
        },
        {
            title: '萤石云',
            value: '3'
        }
    ]

    //去除空参
    function dealObjectValue(obj){
        var param = {};
        if ( obj === null || obj === undefined || obj === "" ) return param;
        for ( var key in obj ){
            if(  obj[key] !== null && obj[key] !== undefined && obj[key] !== ""  ){
                param[key] = obj[key];
            }
        }
        return param;
      };
     //树形列表
  var treeData = []

  //树形结构ajax
  $.ajax({
      url: baseUrl + '/company/ztreelist?token=' + JSON.parse(localStorage.getItem("loginInfo")).token,
      async: false,
      data: {
          type: 1
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
        treeData = function(){
          return res.rows.length !==0 ? res.rows.map(val => {
            return {
                title: val.companyName,
                id: val.id
            }
        }) : []
        }()
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
                deviceSmallType: typeId,
                state: state
              }
          });
      }
  })
    //下拉框value
    var selectDate = [
        {
            title: "请选择单位",
            value: ""
        }
    ]
    var selectList1 = []

    var selectList = []
    var deviceType = [] //设备类型

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
    for (let i = 0; i < $('.button-add').length; i++) {
        $('.button-add')[i].onclick = function () {
            console.log(i)
            layer.open({
                type: 1,
                offset: '180px',
                skin: 'layui-layer-yingke',
                title: '添加设备',
                area: i === 0 ?'900px':['500px','400px'],
                content: $("#pop-up-add")
            });
        }
    }

    $(".button-add-interface").click(function () {
        $("#pop-up-add").html(
            `
            <form class="layui-form" action="">
                <div class="layui-form-item" style='width:100%;margin-top:10px;'>
                    <label class="layui-form-label">设备类型</label>
                    <div class="layui-input-block  layui-required">
                        <input type="text" name="type_sign" required placeholder="请输入" autocomplete="off"
                        class="layui-input">
                    </div>
                </div>
                
                <div class="layui-form-item" style='width:100%;margin-top:10px;'>
                    <label class="layui-form-label">typeName</label>
                    <div class="layui-input-block  layui-required">
                        <input type="text" name="typeName" required placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item" style='width:100%;margin-top:10px;'>
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <input type="text" name="remark" required placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item  layui-form-item-submit">
                        <div style="text-align:center">
                            <button type="submit" class="layui-btn" lay-submit lay-filter="demo1">确认</button>
                            <button type="button" id="close-pop-up" class="layui-btn layui-btn-primary">取消</button>
                        </div>
                </div>
        </form>
       
            `
        )

        form.render()
        $("#close-pop-up").click(function () {
            layer.closeAll();
        })
    })

    $(".button-add-device").click(function () {
        $("#pop-up-add").html(
            `
            <form class="layui-form" action="">
                <div class="layui-form-item">
                    <label class="layui-form-label">所属单位</label>
                    <div class="layui-input-block  layui-required">
                        <select name="companyId" lay-verify="required" lay-filter="companyId-select" lay-search="">
                            <option value="">请选择单位</option>
                            <option value="">请选择单位</option>
                    ${selectList1.map(item => {
                          return `
                                    <option value=${item.id}>${item.companyName}</option>
                                  `
                      })}
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">设备类型</label>
                    <div class="layui-input-block  layui-required">
                        <select name="typeSign" lay-verify="required" lay-search="">
                            <option value=""></option>
                            ${deviceType.map(item => {
                    return `<option value=${item.typeSign}>${item.typeName}</option>`
                })}
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">productId</label>
                    <div class="layui-input-block">
                        <input type="text" name="productId" required placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">app_id</label>
                    <div class="layui-input-block">
                        <input type="text" name="app_id" required placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">masterKey</label>
                    <div class="layui-input-block">
                        <input type="text" name="masterKey" required placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">deviceSmallType</label>
                    <div class="layui-input-block">
                        <input type="text" name="deviceSmallType" required placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">interface_information</label>
                    <div class="layui-input-block">
                        <select name="interface_information" lay-verify="required" lay-search="">
                            <option value="">请选择</option>
                            <option value="1">华为</option>
                            <option value="2">电信</option>
                            <option value="3">萤石云</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">secret</label>
                    <div class="layui-input-block">
                        <input type="text" name="secret" required placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">device_agreement_type</label>
                    <div class="layui-input-block">
                        <input type="text" name="device_agreement_type" required placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <input type="text" name="remark" required placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item  layui-form-item-submit">
                        <div style="text-align:center">
                            <button type="submit" class="layui-btn" lay-submit lay-filter="demo2">确认</button>
                            <button type="button" id="close-pop-up" class="layui-btn layui-btn-primary">取消</button>
                        </div>
                </div>
            </form>
            `
        )

        form.render()
        $("#close-pop-up").click(function () {
            layer.closeAll();
        })
    })

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

    $.ajax({
        url: baseUrl + "/company/ztreelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        async: false,
        traditional: true,
        dataType:"json",
        data: {
          type: 1
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
            selectList1 = res.rows
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
                }
            });
        }

        return false;
    });

   

    table.render({
        elem: '#home',
        id: 'tableReload',
        height: 750,
        url: baseUrl + "/productapi/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        where: {
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
                    field: 'id',
                    align: "center",
                    title: 'id',
                    width: 70,
                    sort: true
                },
                {
                    field: 'companyName',
                    align: "center",
                    width: 200,
                    title: '所属单位'
                },
                {
                    field: 'typeSign',
                    align: "center",
                    title: 'typeSign',
					width: 110,
                    sort: true
                },
                {
                    field: 'productId',
                    align: "center",
                    title: 'productId',
                    sort: true
                },
                {
                    field: 'appId',
                    title: 'appId',
                    align: "center",
                    sort: true
                },
                {
                    field: 'secret',
                    align: "center",
                    title: 'secret',
                    sort: true
                },
                {
                    field: 'deviceSmallType',
                    align: "center",
                    title: '设备类型',
                    sort: true,
                    width: 100
                },
                {
                    field: 'interfaceInformation',
                    align: "center",
                    width: 80,
                    title: '平台',
                    sort: true
                },
                {
                    fixed: 'right',
                    title: '操作',
                    align: "center",
                    width: 120,
                    toolbar: '#barDemo'
                }
            ]
        ]
    });

    //监听行操作事件
    table.on('tool(tableTest)', function (obj) {
        let data = obj.data;
       if (obj.event === 'edit') {
            layer.open({
                type: 1,
                offset: '180px',
                title: '编辑设备',
                skin: 'layui-layer-yingke',
                area: ['900px', '500px'],
                content: $("#pop-up-add"),
                success: function (layero, index) {
                    $("#pop-up-add").html(
                        `
                        <form class="layui-form" action="">
                            <div class="layui-form-item">
                                <label class="layui-form-label">所属单位</label>
                                <div class="layui-input-block  layui-required">
                                    <select name="companyId" lay-verify="required" lay-filter="companyId-select" lay-search="">
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
                                <label class="layui-form-label">设备类型</label>
                                <div class="layui-input-block  layui-required">
                                    <select name="typeSign" lay-verify="required" lay-search="">
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
                                <label class="layui-form-label">productId</label>
                                <div class="layui-input-block">
                                    <input type="text" name="productId" required placeholder="请输入" autocomplete="off"
                                        class="layui-input" value=${data.productId}>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">app_id</label>
                                <div class="layui-input-block">
                                    <input type="text" name="app_id" required placeholder="请输入" autocomplete="off"
                                        class="layui-input" value=${data.appId}>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">masterKey</label>
                                <div class="layui-input-block">
                                    <input type="text" name="masterKey" required placeholder="请输入" autocomplete="off"
                                        class="layui-input" value=${data.masterKey}>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">deviceSmallType</label>
                                <div class="layui-input-block">
                                    <input type="text" name="deviceSmallType" required placeholder="请输入" autocomplete="off"
                                        class="layui-input" value=${data.deviceSmallType}>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">interface_information</label>
                                <div class="layui-input-block">
                                    <select name="interface_information" lay-verify="required" lay-search="">
                                    ${interface_information.map(item => {
                                        return `
                                                ${function () {
                                                if (item.value === data.interfaceInformation) {
                                                    return `<option selected="true" value=${item.value}>${item.title}</option>`
                                                } else {
                                                    return `<option value=${item.value}>${item.title}</option>`
                                                }
                                            }()
                                            }
                                        `
                                    })}
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">secret</label>
                                <div class="layui-input-block">
                                    <input type="text" name="secret" required placeholder="请输入" autocomplete="off"
                                        class="layui-input" value=${data.secret}>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">device_agreement_type</label>
                                <div class="layui-input-block">
                                    <input type="text" name="device_agreement_type" required placeholder="请输入" autocomplete="off"
                                        class="layui-input" value=${data.device_agreement_type}>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-block">
                                    <input type="text" name="remark" required placeholder="请输入" autocomplete="off"
                                        class="layui-input" value=${data.remark}>
                                </div>
                            </div>
                            <div class="layui-form-item  layui-form-item-submit">
                                    <div style="text-align:center">
                                        <button type="submit" class="layui-btn" lay-submit lay-filter="demo2">确认</button>
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
                }
            });
        } else if(obj.event === 'take'){
            $.ajax({
                url: '//newxf.yk-iot.cn/getdata_sub.php',
                data: {
                    id: data.id
                },
                success: function(res){
                    layer.alert(`${res.error_desc}<br/>${res.msg}`, {
                        offset: '300px',
                        skin: 'layui-layer-yingke',
                        area: '200px',
                        title: `提示`
                    });
                }
            })
        }
    });


    //阵列模式
    // $(".wisdom-electricity-bottom-top-type > span").on("click", function () {
    //     $(this).addClass("classifyStyle");
    //     $(this).siblings('span').removeClass('classifyStyle');
    // });


    //新增设备提交
    form.on('submit(demo2)', function (data) {
        $.ajax({
            url: baseUrl + "/productapi/save?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify(dealObjectValue(data.field)),
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
                    layer.msg('设备添加成功', {
                        icon: 1,
                        closeBtn: 0,
                        shade: 0.5,
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

    //新增接口
    form.on('submit(demo1)', function (data) {
        $.ajax({
            url: baseUrl + "/prodect/save?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify(dealObjectValue(data.field)),
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
                    layer.msg('接口添加成功', {
                        icon: 1,
                        closeBtn: 0,
                        shade: 0.5,
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
        $.ajax({
            url: baseUrl + "/productapi/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify(dealObjectValue(data.field)),
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