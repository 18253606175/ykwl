import {
    baseUrl
  } from '../js/params.js'
  layui.use(['element', 'layer', 'upload'], function () {
    var $ = layui.jquery
    var form = layui.form
    var table = layui.table;
    var upload = layui.upload
    var tree = layui.tree;

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
  
  var id = null;
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
                companyId: id
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
  
    var selectList = []
  
    //下拉框请求
    $.ajax({
      url: baseUrl + "/company/ztreelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
      async: false,
      traditional: true,
      dataType:"json",
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
  
    //角色下拉
    var role = []
    $.ajax({
      url: baseUrl + "/role/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
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
          role = res.rows
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
    //表格
    table.render({
      elem: '#unitTable',
      id: 'tableReload',
      url: baseUrl + "/user/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
      height: 750,
      limit: 15,
      limits: [15, 20, 30,40,50,60,70,80,90,100,200,500],
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
        [{
            field: 'id',
            align: "center",
            title: '用户ID',
            width:100
          },  {
          field: 'userName',
          align: "center",
          title: '姓名',
          width:150
        },  {
          field: 'userCode',
          align: "center",
          title: '账号',
        },{
          field: 'roleName',
          align: "center",
          title: '角色',
        }, {
          field: 'phone',
          align: "center",
          title: '电话'
        }, {
          field: 'companyName',
          title: '所属公司',
          align: "center",
          // width:140
        }, {
          field: 'createTime',
          title: '创建时间',
          align: "center",
        } //minWidth：局部定义当前单元格的最小宽度，layui 2.2.1 新增
          , {
          fixed: 'right',
          title: '操作',
          align: "center",
          toolbar: '#barDemo',
          width:190
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

    //监听搜索提交
    form.on('submit(submitDoubleBtn)', function (data) {
      if (data.field.selectDou.length === 0) {
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
            companyId: data.field.selectDou,
          }
        });
    } 
      return false;
    });
  
  
    for (var i = 0; i < $('.button-add').length; i++) {
      $('.button-add')[i].onclick = function () {
        layer.open({
          type: 1,
          offset: '180px',
          skin: 'layui-layer-yingke',
          title: '添加设备',
          area: ['1000px', '550px'],
          content: $("#pop-up-add")
        });
      }
    }
    //点击添加按钮
    $(".button-add").click(function () {
      $("#pop-up-add").html(
        `
            <form class="layui-form" action="">
              <div class="layui-form-item">
                  <label class="layui-form-label">所属单位</label>
                  <div class="layui-input-block  layui-required">
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
                    <label class="layui-form-label layui-required">姓名</label>
                    <div class="layui-input-block">
                        <input type="text" name="userName" placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">账号</label>
                    <div class="layui-input-block">
                        <input type="text" name="userCode" lay-verify="required" placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">角色</label>
                    <div class="layui-input-block">
                    <select name="role" lay-verify="required" lay-search="">
                          <option value="">请选择角色</option>
                          ${role.map(item => {
                            return `
                                                    <option value=${item.id}>${item.name}</option>
                                                `
                        })}
                    </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">密码</label>
                    <div class="layui-input-block">
                        <input type="text" name="password" placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">电话</label>
                    <div class="layui-input-block">
                        <input type="text" name="phone" placeholder="请输入" autocomplete="off"
                            class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item-img">
                    <label class="layui-form-label layui-required">头像</label>
                    <div class="layui-input-block">
                        <div class="layui-upload-drag" id="test10">
                            <i class="layui-icon"></i>
                            <p>点击上传，或将文件拖拽到此处</p>
                            <div class="layui-hide" id="uploadDemoView">
                            <hr>
                            <img src="" alt="上传成功后渲染" style="max-width: 196px">
                            <input type="text" name="imgurl" style="display: none" placeholder="请输入" autocomplete="off"
                              class="layui-input" value="">
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="layui-form-item  layui-form-item-submit">
                    <div style='text-align: center'>
                        <button type="submit" class="layui-btn" lay-submit="" lay-filter="save">确认</button>
                        <button type='button' id="close-pop-up" class="layui-btn">取消</button>
                    </div>
                </div>
            </form>
     
          `
      )
  
      form.render()
  
      $("#close-pop-up").click(function () {
        layer.closeAll();
      })
      //拖拽上传
      upload.render({
        elem: '#test10',
        url:  baseUrl + '/image/uploadimage?token=' + JSON.parse(localStorage.getItem('loginInfo')).token //改成您自己的上传接口
        ,
        done: function (res) {
            layer.msg('上传成功');
            layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src', res.rows);
            layui.$('#uploadDemoView').find('input').val(res.rows);
        }
    });
    })
  
    //监听行单击事件（双击事件为：rowDouble）
    table.on('tool(unitTable)', function (obj) {
      var data = obj.data;
      // obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
      if (obj.event === 'del') {
        layer.confirm('您确定要删除吗？', {
          skin: 'layui-layer-yingke',
          btn: ['确定','取消'] //按钮
        }, function(){
          $.ajax({
            url: baseUrl + "/user/delete?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            contentType: "application/json",
            data: JSON.stringify({
              id: data.id,
              sign: data.sign
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
                  icon: 2,
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
          title: '编辑单位',
          skin: 'layui-layer-yingke',
          area: ['1000px', '550px'],
          content: $("#pop-up-add"),
          success: function (layero, index) {
            $("#pop-up-add").html(
              `
              <form class="layui-form" action="">
                <div class="layui-form-item" style="display: none">
                  <label class="layui-form-label layui-required">id</label>
                  <div class="layui-input-block">
                      <input type="text" name="id" placeholder="请输入" autocomplete="off"
                          class="layui-input" value=${data.id} >
                  </div>
              </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">所属单位</label>
                    <div class="layui-input-block  layui-required">
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
                    <label class="layui-form-label layui-required">姓名</label>
                    <div class="layui-input-block">
                        <input type="text" name="userName" placeholder="请输入" autocomplete="off"
                            class="layui-input" value=${data.userName} >
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">账号</label>
                    <div class="layui-input-block">
                        <input type="text" name="userCode" lay-verify="required" placeholder="请输入" autocomplete="off"
                            class="layui-input" value=${data.userCode}>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label layui-required">角色</label>
                    <div class="layui-input-block">
                    <select name="role" lay-verify="required" lay-search="">
                          <option value="">请选择角色</option>
                    ${role.map(item => {
                      return `
                                ${function () {
                                    if (item.id === data.role) {
                                        return `<option selected="true" value=${item.id}>${item.name}</option>`
                                    } else {
                                        return `<option value=${item.id}>${item.name}</option>`
                                    }
                                }()
                                }
                            `
                  })}
                  </select>
                    </div>
                </div>
                <div class="layui-form-item" style="margin-top: -60px">
                    <label class="layui-form-label layui-required">电话</label>
                    <div class="layui-input-block">
                        <input type="text" name="phone" placeholder="请输入" autocomplete="off"
                            class="layui-input" value=${data.phone}>
                    </div>
                </div>

                <div class="layui-form-item-img" style="margin-top: 16px">
                    <label class="layui-form-label layui-required">头像</label>
                    <div class="layui-input-block">
                        <div class="layui-upload-drag" id="test10">
                            <i class="layui-icon"></i>
                            <p>点击上传，或将文件拖拽到此处</p>
                            <div class="layui-hide" id="uploadDemoView">
                            <hr>
                            <img src=${data.imgurl} alt="上传成功后渲染" style="max-width: 196px">
                            <input type="text" name="imgurl" style="display: none" placeholder="请输入" autocomplete="off"
                              class="layui-input" value="">
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="layui-form-item  layui-form-item-submit">
                    <div style='text-align: center'>
                        <button type="submit" class="layui-btn" lay-submit="" lay-filter="update">确认</button>
                        <button type='button' id="close-pop-up" class="layui-btn">取消</button>
                    </div>
                </div>
            </form>
        
    `
            )
            form.render();
            $("#close-pop-up").click(function () {
              layer.closeAll();
            })
            layui.$('#uploadDemoView').removeClass('layui-hide')
            //拖拽上传
            upload.render({
                elem: '#test10',
                url:  baseUrl + '/image/uploadimage?token=' + JSON.parse(localStorage.getItem('loginInfo')).token //改成您自己的上传接口
                ,
                done: function (res) {
                    layer.msg('上传成功');
                    layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src', res.rows);
                    layui.$('#uploadDemoView').find('input').val(res.rows);
                }
            });
          }
        });
      } else if(obj.event === 'reset'){
        layer.confirm('您确定重置到默认密码(zhxf@ykwl)吗？', {
          btn: ['确定','取消'] //按钮，
          ,skin: 'layui-layer-yingke'
        }, function(){
          $.ajax({
            url: baseUrl + '/user/reset?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
            type: 'post',
            dataType: 'json',
            contentType: "application/json",
            data:JSON.stringify({
              userCode: data.userCode
            }),
            success: function(res){
              if (res.code === 200) {
                layer.msg('重置密码成功', {
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
        }, function(){
         layer.closeAll();
        });
        
      }
    });
  
    //编辑设备提交
    form.on('submit(update)', function (data) {
  
  
      $.ajax({
        url: baseUrl + "/user/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        data: JSON.stringify(dealObjectValue(data.field)),
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
            layer.msg('修改用户成功^_^', {
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


    //新增提交
    form.on('submit(save)', function (data) {
      $.ajax({
        url: baseUrl + "/user/save?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
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
            layer.msg('用户添加成功', {
              icon: 1,
              closeBtn: 0,
              anim: 0, //动画类型
              time: 3000
            }, function () {
              layer.closeAll()
            });
          } else{
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
  
    //关闭弹层
    $("#close-pop-up").click(function () {
      layer.closeAll();
    })

     //弹窗样式
     layer.config({
      //anim: 2, //出场动画
      extend: 'layskin/style.css',
      // skin: 'layui-layer-yingke' //英科专用弹窗样式
  });
  
  })