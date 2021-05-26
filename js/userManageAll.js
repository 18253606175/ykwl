import {
    baseUrl
  } from '../js/params.js'
  layui.use(['element', 'layer', 'upload'], function () {
    var $ = layui.jquery
    var form = layui.form
    var table = layui.table;
    var upload = layui.upload
    //下拉框value
    var selectDate = [
      {
        title: "没有选项",
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
      height: 770,
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
          width:140
        }
        ]
      ]
    });

    //监听搜索提交
    form.on('submit(submitDoubleBtn)', function (data) {
      table.reload('tableReload', {
        page: {
          curr: 1 //重新从第 1 页开始
        },
        where: {
          companyId: data.field.selectDou,
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
                        <input type="text" name="role" lay-verify="required" placeholder="请输入" autocomplete="off"
                            class="layui-input">
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
        layer.prompt({
          title: '请输入密码进行权限验证',
          formType: 1,
        },
          function (pass, index) {
            $.ajax({
              url: baseUrl + "/user/delete?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
              contentType: "application/json",
              data: JSON.stringify({
                id: data.id,
              }),
              type: 'post',
              // dataType: "json",
              success: function (res) {
                if (res.code === 200) {
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
          title: '编辑单位',
          skin: 'layui-layer-yingke',
          area: ['1000px', '550px'],
          content: $("#pop-up-add"),
          success: function (layero, index) {
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
                        <input type="text" name="role" lay-verify="required" placeholder="请输入" autocomplete="off"
                            class="layui-input" value=${data.role}>
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
      }
    });
  
    //编辑设备提交
    form.on('submit(update)', function (data) {
  
      for (var i = 0; i < Object.keys(data.field).length; i++) {
        if (data.field[Object.keys(data.field)[i]].length === 0) {
          delete data.field[Object.keys(data.field)[i]]
        }
      }
  
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
          if (res.code === 200) {
            layer.msg('修改单位成功^_^', {
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
  
  
    //弹窗样式
    layer.config({
      //anim: 2, //出场动画
      extend: 'layskin/style.css',
      //skin: 'layui-layer-yingke' //英科专用弹窗样式
    });
  
  
    //新增提交
    form.on('submit(save)', function (data) {
      console.log(dealObjectValue(data.field))
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
          if (res.code === 200) {
            layer.msg('单位添加成功', {
              icon: 1,
              closeBtn: 0,
              anim: 0, //动画类型
              time: 3000
            }, function () {
              layer.closeAll()
            });
          } else if (res.code === 500) {
            layer.msg(res.msg, {
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
  
    //关闭弹层
    $("#close-pop-up").click(function () {
      layer.closeAll();
    })
  
  })