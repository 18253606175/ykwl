import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer', 'flow'], function () {
    var $ = layui.jquery
    var flow = layui.flow;

    //左侧时间列表
    $.ajax({
        url: baseUrl + '/serve/dateList?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
        data: {
            companyId: JSON.parse(localStorage.getItem('loginInfo')).companyId
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
                
            const {
                list,count
            } = res.rows
            $('.info').html(`
                <p class="titleInfo">${JSON.parse(localStorage.getItem('loginInfo')).companyName}</p>
                <p class="count">统计：共${count}条</p>
            `)
            var leftTypeDate = list.map((item, index) => {

                return `
                        <li class="layui-nav-item select-li" id=${item}><a href="javaScript:;">${item}</a></li>
                    `
            })

            $(".Realtime-left-bottom > .layui-nav").append(leftTypeDate.join(''));

            for (var i = 0; i < document.getElementsByClassName("select-li").length; i++) {

                $(".Realtime-left-bottom > .layui-nav > li")[i].setAttribute("index", i)

                $(".Realtime-left-bottom > .layui-nav > li")[i].onclick = function () {
                    // for (var j = 0; j < $(".Realtime-left-bottom > .layui-nav > li").length - 1; j++) {
                    //     $(".wisdom-electricity-bottom > div")[j].className = "";
                    // }
                    var typeId = this.getAttribute('id')
                    flowReload(typeId)

                }


            }
            $(".select-li").on('click', function () {
                $(this).addClass("layui-this");
                $(this).siblings('li').removeClass('layui-this');
            });
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

    //右侧内容
    //流加载请求列表数据
    function flowReload(param) {
        $('#flow_inspectList').html('');
        flow.load({
            elem: '#flow_inspectList' //流加载容器
                ,
            scrollElem: '#flow_inspectList' //滚动条所在元素，一般不用填，此处只是演示需要。
                ,
            done: function (page, next) { //执行下一页的回调
                var lis = [];
                //模拟数据插入
                $.ajax({
                    url: baseUrl + "/serve/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
                    // async: false,
                    data: {
                        companyId: JSON.parse(localStorage.getItem('loginInfo')).companyId,
                        pageNumber: 1,
                        pageSize: 20,
                        serviceTime: param
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
                        if (res.rows.length === 0) {
                            $(".layui-flow-more").css('display', 'none')
                            $("#flow_inspectList").html('<p id="empty" style="color:#fff">无数据</p>')
                        } else {
                            layui.each(res.rows, function (index, item) {
                                //这里遍历数据
                                lis.push(
                                    `
                                    <span class="timeline-label">
                                        <span class="label label-primary">${item.serviceTime}</span>
                                    </span>
                                    <div class="timeline-item">
                                        <div class="timeline-point timeline-point-success">
                                            <i class="fa fa-money"></i>
                                        </div>
                                        <div class="timeline-event">
                                            <div class="timeline-heading">
                                                <h4>负责人:${item.person}</h4>
                                                <h4>电话:${item.phone}</h4>
                                            </div>
                                            <div class="timeline-body">
                                                <p>内容:${item.serviceContent}</p>
                                            </div>
                                            <div class="timeline-footer">
                                                <p class="text-right">${item.serviceTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                    `
                                );
                            });
                        }

                        next(lis.join(''), page < res.rows.pageCount);
                        $("#empty").remove();
                        $('.layui-flow-more').hide();
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
        });
    }
    flowReload();
   

})
   