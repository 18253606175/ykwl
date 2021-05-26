import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer', 'table', 'form', 'laydate', 'upload'], function () {
    var $ = layui.jquery
    var element = layui.element;
    var table = layui.table;
    var form = layui.form
    var laydate = layui.laydate;
    var upload = layui.upload


    for (var i = 0; i < document.getElementsByClassName("select-li").length; i++) {
        $(".select-li")[i].onclick = function () {
            // console.log($(this).attr('id'))
            if ($(this).attr('id') === "1") {
                $(".iframeBox").css("display", "block")
                $(".tableBox").css("display", "none")
            } else {
                $(".iframeBox").css("display", "none")
                $(".tableBox").css("display", "block")
            }

            table.reload('tableReload', {
                where: {
                    fireType: $(this).attr('index')
                }
            })
        }
    }
    

    table.render({
        elem: '#home',
        id: 'tableReload',
        height: 780,
        url:baseUrl + `/fireFle/list?token=` + JSON.parse(localStorage.getItem('loginInfo')).token,
        limits: [15, 30, 45],
        where: {
            companyId: JSON.parse(localStorage.getItem('loginInfo')).companyId
        },
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
                    field: 'title',
                    align: "center",
                    title: '标题'
                },
                {
                    field: 'content',
                    align: "center",
                    title: '内容'
                },
                {
                    field: 'createTime',
                    align: "center",
                    title: '时间'
                },
                {
                    fixed: 'right',
                    title: '操作',
                    align: "center",
                    toolbar: '#barDemo'
                    // width: 150
                }
            ]
        ],
    });


    //新增
    $(".button-add").click(function () {
        console.log("111")
        layer.open({
            type: 1,
            offset: '180px',
            title: '添加信息',
            skin: 'layui-layer-yingke',
            area: ['500px', '400px'],
            content: $(".dialog"),
            success: function () {
                $(".dialog").html(`<form class="layui-form" action="">
                <div class="layui-form-item">
                    <label class="layui-form-label">标题</label>
                    <div class="layui-input-block">
                        <input type="text" name="imei" lay-verify="imei" required placeholder="请输入" autocomplete="off"
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
                    <div style="text-align: center;">
                        <button type="submit" class="layui-btn" lay-submit lay-filter="update">确认</button>
                        <button type="button" id="close-pop-up" class="layui-btn layui-btn-primary">取消</button>
                    </div>
                </div>
            </form>`)
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
                        layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src', res.rows);
                    }
                });
            }
        });
    })

    //表格查看删除
    table.on('tool(tableTest)', function (obj) {
        var data = obj.data;
        //表格处理
        if (obj.event === 'check') {
            $.ajax({
                url: baseUrl + `/fireFle/info?token=` + JSON.parse(localStorage.getItem('loginInfo')).token,
                data: {
                    id: data.id
                },
                success: function(res){
                    const { rows } = res
                    layer.open({
                        type: 1,
                        offset: '180px',
                        title: '档案详情',
                        skin: 'layui-layer-yingke',
                        area: ['500px', '400px'],
                        content: $(".dialog"),
                        success: function () {
                            $(".dialog").html(`
                            <form class="layui-form" action="">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">标题</label>
                                    <div class="layui-input-block">
                                        <input type="text" name='title' value=${rows.title} required placeholder="请输入" autocomplete="off"
                                        class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">时间</label>
                                    <div class="layui-input-block">
                                        <input type="text" name='createTime' value=${rows.createTime} required placeholder="请输入" autocomplete="off"
                                        class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item-img">
                                        <label class="layui-form-label layui-required">内容</label>
                                        <div class="layui-input-block">
                                            <div class="layui-upload-drag" id="test10">
                                                <i class="layui-icon"></i>
                                                <p>点击上传，或将文件拖拽到此处</p>
                                                <div class="layui-hide" id="uploadDemoView">
                                                    <hr>
                                                    <img src=${rows.fileUrl} alt="上传成功后渲染" style="max-width: 196px">
                                                </div>
                                            </div>
                                        </div>
                                </div>
                                <div class="layui-form-item  layui-form-item-submit">
                                    <div style='text-align: center; margin-top: 40px;'>
                                        <button type="submit" class="layui-btn" lay-submit="" lay-filter="update">确认</button>
                                        <button type='button' id="close-pop-up" class="layui-btn">取消</button>
                                    </div>
                                </div>
                            </form>`)
                        form.render();
                        $("#close-pop-up").click(function () {
                            layer.closeAll();
                        })
                        //拖拽上传
                        upload.render({
                            elem: '#test10',
                            url: baseUrl + '/image/uploadimage?token=' + JSON.parse(localStorage.getItem('loginInfo')).token //改成您自己的上传接口
                            ,
                            done: function (res) {
                                layer.msg('上传成功');
                                layui.$('#uploadDemoView').removeClass('layui-hide').find('img').attr('src', res.rows);
                            }
                        });
                        }
                    })
                }
            })
          } else if(obj.event === 'del'){
            layer.confirm('您确定要删除吗？', {
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
          }
    });




    //编辑设备提交
    form.on('submit(update)', function (data) {
        layer.closeAll();
    });

    //弹窗样式
    layer.config({
        //anim: 2, //出场动画
        extend: 'layskin/style.css',
        //skin: 'layui-layer-yingke' //英科专用弹窗样式
    });

})