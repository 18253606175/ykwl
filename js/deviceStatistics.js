import {
    baseUrl
} from '../js/params.js'
layui.use(['element', 'layer', 'table', 'form', 'laydate'], function () {
    var $ = layui.jquery
    var element = layui.element;
    var table = layui.table;
    var form = layui.form
    var laydate = layui.laydate;
    var tree = layui.tree;
    var typeId = null;
    var state = 0;
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
  
  var id = 0;
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
                companyId: id,
                deviceSmallType: typeId,
                state: state
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

    form.on('submit(submitDoubleBtn)', function (data) {

        if (data.field.companyId.length === 0) {
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
                    companyId: data.field.companyId,
                    deviceSmallType: typeId,
                    state: state
                }
            });
        }

        return false;
    });


    //设备类型分类

    var typeSum = []

    //设备总数
    var typeCount = []

    $.ajax({
        url: baseUrl + '/device/devicetypewithnum?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
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
            var leftType = rows.map(item => {
                typeSum.push(item.type)
                typeCount.push(item.count)
                return item.type_sign
            })
            var leftTypeDate = rows.map((item, index) => {

                return `
                        <li class="layui-nav-item select-li" id=${item.type}><a href="javaScript:;">${item.type_sign}</a></li>
                    `
            })
			var leftTypeDate2 = '<li class="layui-nav-item select-li" style="width:100%" id=""><a href="javaScript:;">全部设备</a></li>' + leftTypeDate.join('');
            $(".Realtime-left-bottom > .layui-nav").append(leftTypeDate2);

            for (var i = 0; i < document.getElementsByClassName("select-li").length; i++) {

                $(".Realtime-left-bottom > .layui-nav > li")[i].setAttribute("index", i)

                $(".Realtime-left-bottom > .layui-nav > li")[i].onclick = function () {
                    // for (var j = 0; j < $(".Realtime-left-bottom > .layui-nav > li").length - 1; j++) {
                    //     $(".wisdom-electricity-bottom > div")[j].className = "";
                    // }
                    typeId = this.getAttribute('id')
                    table.reload('tableReload', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        },
                        where: {
                            state: state,
                            deviceSmallType: typeId,
                            companyId: id
                        }
                    });
                    // $(".wisdom-electricity-bottom > div")[Number(this.getAttribute("index")) + 1].className = "current";
                    //小类型状态筛选
                    for (var i = 0; i < document.getElementsByClassName("typeScreen").length; i++) {
                        $(".typeScreen")[i].setAttribute("index", i)
                        $(".typeScreen")[i].onclick = function () {
                            if (Number(this.getAttribute("index")) === 0) {
                                state = '0'
                            }
                            if (Number(this.getAttribute("index")) === 4) {
                                state = '2'
                            }
                            if (Number(this.getAttribute("index")) === 1) {
                                state = '1'
                            }
                            if (Number(this.getAttribute("index")) === 2) {
                                state = '3'
                            }
                            if (Number(this.getAttribute("index")) === 3) {
                                state = '4'
                            }


                            table.reload('tableReload', {
                                page: {
                                    curr: 1 //重新从第 1 页开始
                                },
                                where: {
                                    state: state,
                                    deviceSmallType: typeId
                                }
                            });



                        }
                    }
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

    var exportData = []
    var tableE = table.render({
        elem: '#home',
        id: 'tableReload',
        height: 750,
		title: '设备统计列表',
        url: baseUrl + "/company/companyAndDevice?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        where: {
            state: state,
            companyId: localStorage.getItem('companyId')
        },
        limit: 15,
        limits: [15, 30, 50, 100, 200, 500, 1000],
        cellMinWidth: 85,
       
        even: true,
        skin: 'row',
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "code": 0, //解析接口状态
                "data": res.rows, //解析数据列表
                "count": res.total,
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
            [ //表头
                {
                    field: 'companyName',
                    title: '单位名称',
                    align: "center",
					width: 230,
					sort: true,
                },
                {
                    field: 'companyLevel',
                    title: '单位等级',
                    align: "center",
                    templet: '#companyLevel',
					sort: true,
                },
                {
                    field: 'deviceSum',
                    align: "center",
                    title: '设备总数',
					sort: true,
                },
                {
                    field: 'eleSum',
                    align: "center",
                    title: '电设备',
					sort: true,
                },
                {
                    field: 'waterSum',
                    align: "center",
                    title: '水设备',
					sort: true,
                },
                {
                    field: 'smokeSum',
                    align: "center",
                    title: '烟感',
					sort: true,
                },{
                    field: 'krqSum',
                    align: "center",
                    title: '可燃气体',
					sort: true,
                },
                {
                    field: 'videoSum',
                    align: "center",
                    title: '摄像头',
					sort: true,
                },
                {
                    field: 'insAddSum',
                    align: "center",
                    title: '巡检点',
					sort: true,
                }
            ]
        ],
        done: function(res){
            exportData= res.data;
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
    $(".exportButton").click(function(){
        table.exportFile(tableE.config.id,exportData, 'xls','设备统计列表');
    })

    $(".wisdom-electricity-bottom-top-type > span").on("click", function () {
        $(this).addClass("classifyStyle");
        $(this).siblings('span').removeClass('classifyStyle');
    });

    //弹窗样式
    layer.config({
        //anim: 2, //出场动画
        extend: 'layskin/style.css',
        //skin: 'layui-layer-yingke' //英科专用弹窗样式
    });

})