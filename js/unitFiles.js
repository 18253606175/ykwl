import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer', 'upload'], function () {
    var form = layui.form
    var table = layui.table;
    var $ = layui.jquery
    var upload = layui.upload
    var myChart = echarts.init(document.getElementById('echars-score'));


    $.ajax({
        url: baseUrl + "/company/info?token=" + JSON.parse(localStorage.getItem('loginInfo')).token + "&companyId=" + JSON.parse(localStorage.getItem('loginInfo')).companyId,
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
                const {
                    rows
                } = res
                $('.projectDes-main-title').html(`${rows.companyName}`)
                $(".projectDes-main-content").html(`
                    <p>单位等级：${function(){
                        if(rows.companyLevel === "admin"){
                            return `总管理`
                        } else if(rows.companyLevel === "agent"){
                            return `
                    经销商 `
                        } else if(rows.companyLevel === "user"){
                            return `
                    普通用户单位 `
                        }
                    }()}</p>
                    <p>消防等级：${rows.fireConLevel === '01' ? '重点消防单位' : '一般消防单位'}</p>
                    <p>单位性质：${rows.companyType}</p>
                    <p>经纬度：${rows.areasCode}</p>
                    <p>行政区划：${rows.companyArea}</p>
                    <p>详细位置：${rows.companyAddress}</p>
                    <p>消防责任人：${rows.fireconperson}</p>
                    <p>消防电话：${rows.alarmTel}</p>
                    <p>创建时间：${rows.createTime ? rows.createTime : '--'}</p>
                `)
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
    //消防评估图
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        series: [{
            name: '',
            type: 'pie',
            radius: '90%',
            center: ['50%', '50%'],
            data: [{
                    value: 335,
                    name: '分数',
                    itemStyle: {
                        color: '#ffa800'
                    }
                },
                {
                    value: 310,
                    name: '扣分',
                    itemStyle: {
                        color: '#b250ff'
                    }
                }
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                    label: {
                        show: false //隐藏标示文字
                    },
                    labelLine: {
                        show: false //隐藏标示线
                    }
                }
            }
        }]
    };
    option && myChart.setOption(option);
    function getTableList(url, indexId, flag){
        function getData(indexId){
            if(indexId === '0'){
                return {
                    companyId: JSON.parse(localStorage.getItem('loginInfo')).companyId,
                }
            } else {
                return {
                    companyId: JSON.parse(localStorage.getItem('loginInfo')).companyId,
                    fireType: indexId
                }
            }
        }
        table.render({
            elem: '#home',
            id: 'tableReload',
            height: 400,
            url: baseUrl + `/${url}/list?token=` + JSON.parse(localStorage.getItem('loginInfo')).token,
            where: getData(indexId),
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
            cols: flag ? [
                [ //表头
                    {
                        field: 'articleTitle',
                        align: "center",
                        title: '标题'
                    },
                    {
                        field: 'articleContent',
                        align: "center",
                        title: '内容'
                    },
                    {
                        fixed: 'right',
                        title: '操作',
                        align: "center",
                        toolbar: '#barDemo'
                        // width: 150
                    }
                ]
            ] : [
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
                        fixed: 'right',
                        title: '操作',
                        align: "center",
                        toolbar: '#barDemo'
                        // width: 150
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
    }
    

    for (var i = 0; i < document.getElementsByClassName("record").length; i++) {
        $(".record")[i].onclick = function () {
            let index = $(this).attr('index')
            layer.open({
                type: 1,
                offset: '180px',
                title: '档案信息',
                skin: 'layui-layer-yingke',
                area: ['900px', '500px'],
                content: $(".dialog"),
                success: function () {
                    if(index === "0"){
                        getTableList('article', index, true)
                    } else {
                        getTableList('fireFle', index,)
                    }
                }
            });
        }
    }

    //详情弹窗
    function dialog(flag, id){
        let urlParam = flag ? 'article' : 'fireFle'
        $.ajax({
            url: baseUrl + `/${urlParam}/info?token=` + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: {
                id: id
            },
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
                    const { rows } = res
                    $(".dialog-son").html(`
                        <form class="layui-form" action="">
                            <div class="layui-form-item">
                                <label class="layui-form-label">标题</label>
                                <div class="layui-input-block">
                                    <input style="border: none" type="text" name=${flag ? 'articleTitle' : 'title'} value=${flag ? rows.articleTitle : rows.title} required disabled placeholder="请输入" autocomplete="off"
                                    class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">时间</label>
                                <div class="layui-input-block">
                                    <input style="border: none" type="text" name='createTime' value=${rows.createTime} required disabled placeholder="请输入" autocomplete="off"
                                    class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item-img">
                                    <label class="layui-form-label layui-required">内容</label>
                                    <div class="layui-input-block">
                                        ${flag ? `<textarea placeholder="请输入内容" disabled class="layui-textarea">${flag ? rows.articleContent : rows.content}</textarea>` : 
                                        `<div class="layui-upload-drag" id="test10">
                                            <img src=${rows.fileUrl} alt="图片未上传或加载失败" style="max-width: 196px">
                                        </div>`}
                                    </div>
                            </div>
                        </form>`)
                        form.render();
                        $("#close-pop-up").click(function () {
                            layer.closeAll();
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
    }
    //表格查看删除
    table.on('tool(tableTest)', function (obj) {
        var data = obj.data;
        //表格处理
        if (obj.event === 'check') {
            layer.open({
                type: 1,
                offset: '180px',
                title: '档案详情',
                skin: 'layui-layer-yingke',
                area: ['500px', '400px'],
                content: $(".dialog-son"),
                success: function (res) {
                    let flag = "articleTitle" in data
                    dialog(flag, data.id)
                    
                }
            })
        }
    });

    //弹窗样式
    layer.config({
        //anim: 2, //出场动画
        extend: 'layskin/style.css',
        //skin: 'layui-layer-yingke' //英科专用弹窗样式
    });
    // $('.projectDes-main-content').append(`<p>消防安全管理人电话：${localStorage.getItem('aaa')}</p>`)
})