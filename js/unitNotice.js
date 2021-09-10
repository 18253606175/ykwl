import {
    baseUrl
  } from '../js/params.js'
  layui.use(['element', 'layer', 'upload', 'laydate'], function () {
    var $ = layui.jquery
    var form = layui.form
    var table = layui.table;
    var upload = layui.upload
    var laydate = layui.laydate;
   
    
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
      url: baseUrl + "/article/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
      height: 750,
      where: {
          companyId: JSON.parse(localStorage.getItem('loginInfo')).companyId
      },
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
            field: 'articleTitle',
            align: "center",
            title: '标题'
          },  {
          field: 'articleContent',
          align: "center",
          title: '内容'
        }, {
          field: 'createTime',
          title: '创建时间',
          align: "center",
        } //minWidth：局部定义当前单元格的最小宽度，layui 2.2.1 新增
        //   , {
        //   fixed: 'right',
        //   title: '操作',
        //   align: "center",
        //   toolbar: '#barDemo',
        //   width:140
        // }
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

   
  
  //添加
    for (var i = 0; i < $('.button-add').length; i++) {
      $('.button-add')[i].onclick = function () {
        layer.open({
          type: 1,
          offset: '180px',
          skin: 'layui-layer-yingke',
          title: '新增公告',
          area: ['700px', '500px'],
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
            <label class="layui-form-label">标题</label>
            <div class="layui-input-block">
                <input type="text" name='articleTitle'  placeholder="请输入" autocomplete="off"
                class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">公告类型</label>
            <div class="layui-input-block">
                <select name="articleType" lay-verify="required" lay-search="">
                        <option value="">请选择公告类型</option>
                        <option value=0>公告</option>
                        <option value=1>消防类型</option>
                </select>
            </div>
        </div>
        <div class="layui-form-item-img">
                <label class="layui-form-label layui-required">内容</label>
                <div class="layui-input-block">
                    <textarea name="articleContent" id="editor" rows="10"  placeholder="请输入内容"  class="layui-textarea"></textarea>
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
  
      form.render()
  
      $("#close-pop-up").click(function () {
        layer.closeAll();
      })
      laydate.render({
        elem: '#date'
        ,type: 'datetime'
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
            url: baseUrl + "/article/delete?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
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
          title: '编辑公告',
          skin: 'layui-layer-yingke',
          area: ['700px', '500px'],
          content: $("#pop-up-add"),
          success: function (layero, index) {
            $("#pop-up-add").html(
              `
              <form class="layui-form" action="">
                <div class="layui-form-item">
                    <label class="layui-form-label">标题</label>
                    <div class="layui-input-block">
                        <input type="text" name='articleTitle' value=${data.articleTitle}  placeholder="请输入" autocomplete="off"
                        class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">时间</label>
                    <div class="layui-input-block">
                        <input type="text" name="createTime" id="date"  value=${data.createTime} placeholder="请选择日期" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item-img">
                        <label class="layui-form-label layui-required">内容</label>
                        <div class="layui-input-block">
                            <textarea id="editor" rows="10"  placeholder="请输入内容"  class="layui-textarea">${data.articleContent}</textarea>
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
            $("#close-pop-up").click(function () {
              layer.closeAll();
            })

            laydate.render({
                elem: '#date'
                ,type: 'datetime'
              });

          }
        });
      }
    });
  
    //编辑公告提交
    form.on('submit(update)', function (data) {
  
  
      $.ajax({
        url: baseUrl + "/article/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
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
            layer.msg('编辑公告成功', {
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
        url: baseUrl + "/article/save?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
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
            layer.msg('公告添加成功', {
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