import {
    baseUrl
} from './params.js'
layui.use(['element', 'layer', 'laydate', 'form', 'upload'], function () {
    var $ = layui.jquery
    var laydate = layui.laydate;
    var form = layui.form
    var upload = layui.upload
    var element = layui.element

    //添加
    $('.button-add').click(function () {
        layer.open({
            type: 1,
            offset: '180px',
            title: '添加单位',
            skin: 'layui-layer-yingke',
            area: ['1000px', '450px'],
            content: $("#pop-up-add"),
            success: function () {
                $("#pop-up-add").html(`
                <form class="layui-form" action="">
                    <div class="layui-form-item">
                        <label class="layui-form-label layui-required">昵称</label>
                        <div class="layui-input-block">
                            <input type="text" name="userName" lay-verify="required" placeholder="请输入" autocomplete="off"
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
                                <option value=""></option>
                                <option value="0">北京</option>
                                <option value="1">上海</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label layui-required">密码</label>
                        <div class="layui-input-block">
                            <input type="text" name="password" lay-verify="required" placeholder="请输入" autocomplete="off"
                                class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item" style="margin-bottom: 120px">
                        <label class="layui-form-label layui-required">电话</label>
                        <div class="layui-input-block">
                            <input type="text" name="phone" lay-verify="required" placeholder="请输入" autocomplete="off"
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
            
                `)
                form.render();
                $("#close-pop-up").click(function () {
                    layer.closeAll();
                  })
                //拖拽上传
                upload.render({
                    elem: '#test10',
                    url: 'https://httpbin.org/post' //改成您自己的上传接口
                    ,
                    done: function (res) {
                        layer.msg('上传成功');
                        layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src', res.files.file);
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
    $.ajax({
        url: baseUrl + '/user/list?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
        data: {
            pageNumber: 1,
            pageSize: 20,
            companyId: JSON.parse(localStorage.getItem('loginInfo')).companyId
        },
        success: function (res) {
            var userList = res.rows.rows.map(item => {
                return `
                <div class="layui-col-md4">
                    <div class="layui-panel">
                        <div class="layui-card">
                            <div class="layui-card-header">
                                <p>${item.role}</p>
                                <div class="handle-btn">
                                    <button id=${item.id} type="button" class="layui-btn edit-btn">
                                        <i class="layui-icon layui-icon-edit"></i>
                                    </button>
                                    <button type="button" class="layui-btn delete-btn">
                                        <i class="layui-icon layui-icon-delete"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="layui-card-body">
                                <img src="./img/green.png" alt="">
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

            $(".layui-row").append(userList.join(""))

            //编辑
            $('.edit-btn').click(function () {
                $.ajax({
                    url: baseUrl + '/user/list?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
                    data: {
                        id: $(this).attr('id')
                    } ,
                    success: function(res){
                        layer.open({
                            type: 1,
                            offset: '180px',
                            title: '添加单位',
                            skin: 'layui-layer-yingke',
                            area: ['1000px', '450px'],
                            content: $("#pop-up-add"),
                            success: function (response) {
                                $("#pop-up-add").html(`
                        <form class="layui-form" action="">
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
                                        <option value=""></option>
                                        <option value="0">北京</option>
                                        <option value="1">上海</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label layui-required">密码</label>
                                <div class="layui-input-block">
                                    <input type="text" name="password" lay-verify="required" placeholder="请输入" autocomplete="off"
                                        class="layui-input" value=${res.rows.password}>
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
                                //拖拽上传
                                upload.render({
                                    elem: '#test10',
                                    url: 'https://httpbin.org/post' //改成您自己的上传接口
                                    ,
                                    done: function (res) {
                                        layer.msg('上传成功');
                                        layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src', res.files.file);
                                    }
                                });
                            }
                        });
                    }
                })
            })

            //删除

            $('.delete-btn').click(function () {
                //询问框
                layer.confirm('您确认要删除啊？', {
                    btn: ['确认', '取消'] //按钮
                });
            })
        }
    })

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
                if (res.code === 200) {
                    layer.msg('用户添加成功', {
                        icon: 1,
                        closeBtn: 0,
                        shade: 0.5,
                        shadeClose: true,
                        anim: 0, //动画类型
                        time: 2000
                    }, function () {
                        layer.closeAll();
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

    //编辑提交update
    form.on('submit(update)', function (data) {

        for (var i = 0; i < Object.keys(data.field).length; i++) {
            if (data.field[Object.keys(data.field)[i]].length === 0) {
                delete data.field[Object.keys(data.field)[i]]
            }
        }

        $.ajax({
            url: baseUrl + "/user/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify(data.field),
            contentType: "json/application",
            type: 'post',
            dataType: "json",
            success: function (res) {
                if (res.code === 200) {
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
})