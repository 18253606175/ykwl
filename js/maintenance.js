import {
    baseUrl
  } from '../js/params.js'
  layui.use(['element', 'layer'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var table = layui.table;
    var laydate = layui.laydate;
    //下拉框value
    var selectDate = [
      {
        title: "没有选项",
        value: ""
      }
    ]
  
    var selectList = []
    var selectList1 = []
  
    //单位等级
    var companyLevel = [
      {
        title: '消防联网单位',
        value: 'user'
      },
      {
        title: '消防运营商',
        value: 'agent'
      }	
    ]
  
    //消防等级
    var fireConLevel = [
      {
        title: '重点消防单位',
        value: '01'
      },
      {
        title: '消防一般单位',
        value: '02'
      }
    ]
  
    //单位类别
    var companyType = [
      {
        title: '生产企业',
        value: '生产企业'
      },
      {
        title: '医院',
        value: '医院'
      },
      {
        title: '学校',
        value: '学校'
      },
      {
        title: '加油站',
        value: '加油站'
      },
      {
        title: '机关单位',
        value: '机关单位'
      },
      {
        title: '娱乐场所',
        value: '娱乐场所'
      }
      
    ]
  
    var a = ['admin', 'agent']
  
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
  
    //表格
    table.render({
      elem: '#unitTable',
      id: 'tableReload',
      url: baseUrl + "/serve/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
      height: 730,
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
        };
      },
      request: {
        pageName: 'pageNumber' //页码的参数名称，默认：page
        ,
        limitName: 'pageSize' //每页数据量的参数名，默认：limit
      },
      cols: [
        [{
          field: 'serviceType',
          align: "center",
          title: '服务类型'
        },  {
          field: 'serviceContent',
          align: "center",
          title: '服务内容内容'
        },{
          field: 'serviceTime',
          align: "center",
          title: '服务时间'
        }, {
          field: 'serviceResult',
          align: "center",
          title: '服务结果'
        }, {
          field: 'person',
          align: "center",
          title: '填写人'
        }
        // , {
        //   fixed: 'right',
        //   title: '操作',
        //   align: "center",
        //   toolbar: '#barDemo',
        //   width:140
        // }
        ]
      ]
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

    //监听搜索提交
    form.on('submit(submitDate)', function (data) {
      table.reload('tableReload', {
        page: {
          curr: 1 //重新从第 1 页开始
        },
        where: {
          serviceTime: data.field.serviceTime,
        }
      });
      return false;
    });
  
  
    for (var i = 0; i < $('.button-add').length; i++) {
      $('.button-add')[i].onclick = function () {
        layer.open({
          type: 1,
          offset: '180px',
          skin: 'layui-layer-yingke',
          title: '添加日志',
          area: '600px',
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
              <label class="layui-form-label">公告类型</label>
              <div class="layui-input-block">
                  <select name="articleType" lay-verify="required" lay-search="">
                          <option value="">请选择公告类型</option>
                          <option value="1">消防合法文书</option>
                          <option value="2">消防平面图</option>
                          <option value="3">消防预案</option>
                          <option value="4">规章制度</option>
                          <option value="5">消防培训</option>
                  </select>
              </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">标题</label>
                <div class="layui-input-block">
                    <input type="text" name="articleTitle" required placeholder="请输入" autocomplete="off"
                    class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">内容</label>
                <div class="layui-input-block">
                    <input type="text" name="articleContent" required placeholder="请输入" autocomplete="off"
                    class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">服务时间</label>
                <div class="layui-input-block">
                <input type="text" name="serviceTime" id="date1" lay-verify="date" placeholder="请选择日期" autocomplete="off" class="layui-input">
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
      laydate.render({
        elem: '#date1'
      });
      form.render()
      
  
      $("#close-pop-up").click(function () {
        layer.closeAll();
      })
      //百度地图
      $("#map").focus(function () {
        layer.open({
          id: "HomeForm",
          type: 2,
          title: '百度地图',
          shadeClose: true,
          shade: 0.8,
          area: ['50%', '70%'],
          content: '../map.html', //iframe的url
        });
      })
    })
  
    //监听行单击事件（双击事件为：rowDouble）
    table.on('tool(unitTable)', function (obj) {
      var data = obj.data;
      // obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
      if (obj.event === 'del') {
        layer.prompt({
          title: '请输入密码进行权限验证',
          formType: 1,
        },
          function (pass, index) {
            $.ajax({
              url: baseUrl + "/company/delete?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
              contentType: "application/json",
              data: JSON.stringify({
                id: data.id,
                password: pass
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
            layer.close(index);
          });
      } else if (obj.event === 'edit') {
        layer.open({
          type: 1,
          offset: '180px',
          title: '编辑日志',
          skin: 'layui-layer-yingke',
          area: '900px',
          content: $("#pop-up-add"),
          success: function (layero, index) {
            $("#pop-up-add").html(
              `<form class="layui-form" action="">
              <div class="layui-form-item">
                 <label class="layui-form-label">公告类型</label>
                 <div class="layui-input-block">
                     <select name="articleType" lay-verify="required" lay-search="">
                             <option value="">请选择公告类型</option>
                             <option value="1">消防合法文书</option>
                             <option value="2">消防平面图</option>
                             <option value="3">消防预案</option>
                             <option value="4">规章制度</option>
                             <option value="5">消防培训</option>
                     </select>
                 </div>
               </div>
               <div class="layui-form-item">
                   <label class="layui-form-label">标题</label>
                   <div class="layui-input-block">
                       <input type="text" name="articleTitle" required placeholder="请输入" autocomplete="off"
                       class="layui-input">
                   </div>
               </div>
               <div class="layui-form-item">
                   <label class="layui-form-label">内容</label>
                   <div class="layui-input-block">
                       <input type="text" name="articleContent" required placeholder="请输入" autocomplete="off"
                       class="layui-input">
                   </div>
               </div>
               <div class="layui-form-item">
                   <label class="layui-form-label">服务时间</label>
                   <div class="layui-input-block">
                   <input type="text" name="serviceTime" id="date2" lay-verify="date" placeholder="请选择日期" autocomplete="off" class="layui-input">
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
            laydate.render({
              elem: '#date2'
            });
            //关闭弹层
            $('*[lay-tips]').on('mouseenter', function(){
                  var content = $(this).attr('lay-tips');
                  this.index = layer.tips(content, this,
                  {
                  time: -1
                  //,maxWidth: 200
                  ,tips: [4, '#000']
                  });
              }).mouseleave(function(){
                  layer.closeAll('tips'); //关闭所有的tips层
              })
            $("#close-pop-up").click(function () {
              layer.closeAll();
            })
            //百度地图
            $("#map").focus(function () {
              layer.open({
                id: "HomeForm",
                type: 2,
                title: '百度地图',
                shadeClose: true,
                shade: 0.8,
                area: ['50%', '70%'],
                content: '../map.html', //iframe的url
              });
            })
          }
        });
      }
    });
    laydate.render({
      elem: '#date'
    });
    //编辑设备提交
    form.on('submit(update)', function (data) {
  
      for (var i = 0; i < Object.keys(data.field).length; i++) {
        if (data.field[Object.keys(data.field)[i]].length === 0) {
          delete data.field[Object.keys(data.field)[i]]
        }
      }
  
      $.ajax({
        url: baseUrl + "/serve/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
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
            layer.msg('日志单位成功^_^', {
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
  
  
    //监听提交
    form.on('submit(save)', function (data) {
      $.ajax({
        url: baseUrl + "/serve/save?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
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
            layer.msg('日志添加成功', {
              icon: 1,
              closeBtn: 0,
              anim: 0, //动画类型
              time: 3000
            }, function () {
              layer.closeAll()
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
  
    //关闭弹层
    $("#close-pop-up").click(function () {
      layer.closeAll();
    })
  
  })

