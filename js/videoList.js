import {
    baseUrl
} from '../js/params.js'

layui.use(['element', 'layer', 'table',  'laydate', 'tree'], function () {
    var $ = layui.jquery
    var element = layui.element;
    var table = layui.table;
    var tree = layui.tree;
    // 视频监控
    
    var treeData = []

    //树形结构ajax
    $.ajax({
        url: baseUrl + '/company/listbydevicedmalltype?token=' + JSON.parse(localStorage.getItem("loginInfo")).token,
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
                if(res.rows.length === 0){
                    layer.alert('该单位暂无视频监控', {
                        skin: 'layui-layer-yingke' //样式类名
                        ,closeBtn: 0
                      }, function(){
                        layer.closeAll();
                      });
                }else{
                    treeData = res.rows.map(item => {
                        return {
                            title: item.companyName,
                            id: item.id,
                            spread: true,
                            children: item.videoUrlVOS.map(i => {
                                return {
                                    title: i.location,
                                    id: i.id,
                                    url: i.flvUrl,
                                    spread: true
                                }
                            })
                        }
                    })
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
    var videourl = null;
    var title = null;
    $("#video2").html(`
    <live-player id="live-player" video-url='' live="true" stretch="true" aspect='fullscreen' video-title=${treeData[0].children[0].title} controls="true" hide-big-play-button="true"></live-player>
    `)
    //树形结构
    tree.render({
        elem: '#zreeList',
        data: treeData,
        showLine: true //是否开启连接线
            ,
        click: function (obj) {
            //节点高亮
            var nodes = document.getElementsByClassName("layui-tree-txt");
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].innerHTML === obj.data.title) {
                    nodes[i].style.color = "red";
                    nodes[i].style.fontWeight = "Bold";
                } else {
                    nodes[i].style.color = "#a3c1b0";
                    nodes[i].style.fontWeight = "normal";
                }

            }
            videourl = obj.data.url;
            title = obj.data.title;
            $("#video2").html(`
                <live-player id="live-player" video-url=${videourl} live="true" stretch="true" aspect='fullscreen' video-title=${title} controls="true" hide-big-play-button="true"></live-player>
            `)
        }
    })
})