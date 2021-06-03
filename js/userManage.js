import {
    baseUrl
} from './params.js'
layui.use(['element', 'layer', 'laydate', 'form', 'upload'], function () {
    var $ = layui.jquery
    var laydate = layui.laydate;
    var form = layui.form
    var upload = layui.upload
    var element = layui.element
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
      //角色
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
    //下拉框value
    var selectDate = [{
        title: "没有选项",
        value: ""
    }]

    var selectList = []
    var selectList1 = []

    //下拉框请求
    $.ajax({
        url: baseUrl + "/company/ztreelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        async: false,
        traditional: true,
        dataType: "json",
        success: function (res) {
            if (res.code === 20001) {
                layer.alert('登录已过期请重新登陆', {
                    skin: 'layui-layer-yingke' //样式类名
                        ,
                    closeBtn: 0
                }, function () {
                    parent.location.href = './index.html'
                });
            } else if (res.code === 200) {
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

    //监听搜索提交
    // form.on('submit(submitDoubleBtn)', function (data) {
    //     table.reload('tableReload', {
    //     page: {
    //         curr: 1 //重新从第 1 页开始
    //     },
    //     where: {
    //         companyId: data.field.selectDou,
    //     }
    //     });
    //     return false;
    // });

    //添加
    $('.button-add').click(function () {
        layer.open({
            type: 1,
            offset: '180px',
            title: '添加用户',
            skin: 'layui-layer-yingke',
            area: ['1000px', '500px'],
            content: $("#pop-up-add"),
            success: function () {$("#pop-up-add").html(
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
                        <div class="layui-form-item-img" style="position: relative;
                        top: 0;
                        left: 38px;">
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
            }
        });
    })

    laydate.render({
        elem: '#test4',
        type: 'datetime'
    });

    //用户列表
   function getData(){

    $.ajax({
        url: baseUrl + '/user/listbycompany?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
        data: {
            companyId: JSON.parse(localStorage.getItem('loginInfo')).companyId
        },
        success: function (res) {
            if (res.code === 20001) {
                layer.alert('登录已过期请重新登陆', {
                    skin: 'layui-layer-yingke' //样式类名
                        ,
                    closeBtn: 0
                }, function () {
                    parent.location.href = './index.html'
                });
            } else if (res.code === 200) {

                var userList = res.rows.map(item => {
                    return `
                    <div class="layui-col-md4">
                        <div class="layui-panel">
                            <div class="layui-card">
                                <div class="layui-card-header">
                                    <p>${role.map(i => {
                                        if(i.id === item.role){
                                            return i.name
                                        }
                                    }).join('')}</p>
                                    <div class="handle-btn">
                                        <button id=${item.id}  type="button" class="layui-btn edit-btn">
                                            <i class="layui-icon layui-icon-edit"></i>
                                        </button>
                                        <button id=${item.id} index=${item.sign} type="button" class="layui-btn delete-btn">
                                            <i class="layui-icon layui-icon-delete"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="layui-card-body">
                                    <img src=${item.imgurl ? item.imgurl : 'http://t.cn/RCzsdCq'} alt="">
                                    <div>
                                        <p>${item.userName}</p>
                                        <p>${item.userCode}</p>
                                        <p>${item.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                })

                $(".layui-row").html(userList.join(""))

                //编辑
                $('.edit-btn').click(function () {
                    $.ajax({
                        url: baseUrl + '/user/info?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
                        data: {
                            id: $(this).attr('id')
                        },
                        success: function (res) {
                            if (res.code === 20001) {
                                layer.alert('登录已过期请重新登陆', {
                                    skin: 'layui-layer-yingke' //样式类名
                                        ,
                                    closeBtn: 0
                                }, function () {
                                    parent.location.href = './index.html'
                                });
                            } else if (res.code === 200) {

                                layer.open({
                                    type: 1,
                                    offset: '180px',
                                    title: '编辑单位',
                                    skin: 'layui-layer-yingke',
                                    area: ['1000px', '450px'],
                                    content: $("#pop-up-add"),
                                    success: function (response) {
                                        $("#pop-up-add").html(`
                            <form class="layui-form" action="">
                            <div class="layui-form-item" style="display: none">
                                <label class="layui-form-label layui-required">id</label>
                                <div class="layui-input-block">
                                    <input type="text" name="id" placeholder="请输入" autocomplete="off"
                                        class="layui-input" value=${res.rows.id} >
                                </div>
                            </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label layui-required">昵称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="userName" lay-verify="required" placeholder="请输入" autocomplete="off"
                                            class="layui-input" value=${res.rows.userName}>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label layui-required">账号</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="userCode" lay-verify="required" placeholder="请输入" autocomplete="off"
                                            class="layui-input" value=${res.rows.userCode}>
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
                                              if (item.id === res.rows.role) {
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
                                <div class="layui-form-item" style="margin-bottom: 120px">
                                    <label class="layui-form-label layui-required">电话</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="phone" lay-verify="required" placeholder="请输入" autocomplete="off"
                                            class="layui-input" value=${res.rows.phone}>
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
                                            <img src=${res.rows.imgurl} alt="上传成功后渲染" style="max-width: 196px">
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
                        
                            `)
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
                })

                //删除

                $('.delete-btn').click(function () {    
                    let id = $(this).attr('id')
                    let sign = $(this).attr('index')
                    layer.confirm('您确定要删除吗？', {
                        skin: 'layui-layer-yingke',
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        $.ajax({
                        url: baseUrl + "/user/delete?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
                        contentType: "application/json",
                        data: JSON.stringify({
                            id: id,
                            sign: sign
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
           
                            layer.msg('删除成功', {
                                icon: 1,
                                closeBtn: 0,
                                anim: 0, //动画类型
                                time: 3000
                            });
                            getData();
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
                })
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
   }

   getData();

   

    //添加提交save
    form.on('submit(save)', function (data) {
        for (var i = 0; i < Object.keys(data.field).length; i++) {

            if (data.field[Object.keys(data.field)[i]].length === 0) {
                delete data.field[Object.keys(data.field)[i]]
            }
        }

        $.ajax({
            url: baseUrl + "/user/save?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify(data.field),
            contentType: "json/application",
            type: 'post',
            dataType: "json",
            success: function (res) {
                if (res.code === 20001) {
                    layer.alert('登录已过期请重新登陆', {
                        skin: 'layui-layer-yingke' //样式类名
                            ,
                        closeBtn: 0
                    }, function () {
                        parent.location.href = './index.html'
                    });
                } else if (res.code === 200) {
                    layer.msg('用户添加成功', {
                        icon: 1,
                        closeBtn: 0,
                        shade: 0.5,
                        shadeClose: true,
                        anim: 0, //动画类型
                        time: 2000
                    }, function () {
                        getData();
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

    //编辑提交update
    form.on('submit(update)', function (data) {
  
  
        $.ajax({
          url: baseUrl + "/user/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
          data: JSON.stringify(dealObjectValue(data.field)),
          contentType: "json/application",
          type: 'post',
          dataType: "json",
          success: function (res) {
            getData();
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

    //弹窗样式
    layer.config({
        //anim: 2, //出场动画
        extend: 'layskin/style.css',
        //skin: 'layui-layer-yingke' //英科专用弹窗样式
    });
})