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
    var tableData = []

    var deviceType = [] //设备类型
    var architecture = [] //建筑
    var fllorNum = [] //楼层
    for (var i = -3; i <= 20; i++) {
        fllorNum.push(i)
    }

    //设备类型
    $.ajax({
        url: baseUrl + "/prodect/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token,
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
                deviceType = res.rows
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


    //所属建筑
    $.ajax({
        url: baseUrl + "/architecture/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token,
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
                architecture = res.rows
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





    $(".button-add").click(function () {
        $("#pop-up-add").html(
            `
            <form class="layui-form" action="">
            <div class="layui-form-item">
                <label class="layui-form-label">所属单位</label>
                <div class="layui-input-block  layui-required">
                    <select name="companyId" lay-verify="required" lay-filter="companyId-select" lay-search="">
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
                <label class="layui-form-label">设备类型</label>
                <div class="layui-input-block  layui-required">
                    <select name="typeSign" lay-verify="required" lay-search="">
                        <option value=""></option>
                        ${deviceType.map(item => {
                return `<option value=${item.typeSign}>${item.typeName}</option>`
            })}
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">设备编号</label>
                <div class="layui-input-block  layui-required">
                    <input type="text" name="imei" lay-verify="imei" required placeholder="请输入" autocomplete="off"
                        class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
            <label class="layui-form-label">位置描述</label>
            <div class="layui-input-block  layui-required">
                <input type="text" name="location" lay-verify="address" required placeholder="请输入" autocomplete="off"
                    class="layui-input">
            </div>
        </div>
            <div class="layui-form-item">
                <label class="layui-form-label">所属建筑</label>
                <div class="layui-input-block">
                <select name="architectureId" lay-filter="" id="architectureId-select">
                    <option value="">请选择单位</option>
                </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">所属楼层</label>
                <div class="layui-input-block">
                    <select name="floor" lay-search="">
                        <option value=""></option>
                        ${function () {
                var fllorNum = [] //楼层
                for (var i = -3; i <= 20; i++) {
                    fllorNum.push(i)
                }
                return fllorNum.map(item => {
                    return `${function () {
                        if (item === 1) {
                            return `<option value=${item} selected=${item === "1" ? true : false}>${item}</option>`
                        } else {
                            return `<option value=${item}>${item}</option>`
                        }
                    }()}`
                })
            }()
            }
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">物联网卡号</label>
                <div class="layui-input-block">
                    <input type="text" name="iccid" placeholder="请输入" autocomplete="off" class="layui-input">
                </div>
            </div>
			<div class="layui-form-item">
                <label class="layui-form-label">设备验证码</label>
                <div class="layui-input-block">
                    <input type="text" name="validateCode" placeholder="添加监控设备必填" autocomplete="off" class="layui-input">
                </div>
            </div>
			<div class="layui-form-item">
				<label class="layui-form-label">水容器长度</label>
				<div class="layui-input-block">
					<input type="text" name="length" placeholder="水位设备必填" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">水容器宽度</label>
				<div class="layui-input-block">
					<input type="text" name="width" placeholder="水位设备必填" autocomplete="off" class="layui-input" >
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">水容器高度</label>
				<div class="layui-input-block">
					<input type="text" name="height" placeholder="水位设备必填" autocomplete="off" class="layui-input">
				</div>
			</div>
            <div class="layui-form-item">
                <label class="layui-form-label">设备IOT-ID</label>
                <div class="layui-input-block">
                    <input type="text" name="deviceId" placeholder="请输入" autocomplete="off" class="layui-input">
                </div>
            </div>
			
			<div class="layui-form-item  layui-form-item-submit">
                    <div style="text-align:center">
                        <button type="submit" class="layui-btn" lay-submit lay-filter="demo1">确认</button>
						<button type="button" id="close-pop-up" class="layui-btn layui-btn-primary">取消</button>
                    </div>
               </div>
            
        </form>
       
            `
        )

        form.render()
        laydate.render({
            elem: '#date',
            type: 'datetime'
        });
        $("#close-pop-up").click(function () {
            layer.closeAll();
        })


        form.verify({
            imei: [
                /^[\S]{11,15}$/
                , 'IEMI可能错误，请核对'
            ],
            address: function (value) {
                if (value.length < 5) {
                    return '地址不够详细，至少得6个字';
                }
            }
        });
    })

    //关闭弹层


    //头部内容

    var titleContent = {
        company: "英科",
        user: "例",
        address: "地址"
    }

    var titleBottom = {
        deviceSum: 10,
        deviceAlarm: 10,
        deviceOnLine: 10,
        deviceOffLine: 10
    }

    // 请求头部内容
    $.ajax({
        url: baseUrl + '/company/infoanddevicetype?token=' + JSON.parse(localStorage.getItem('loginInfo')).token + '&companyId=' + JSON.parse(localStorage.getItem('loginInfo')).companyId,
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
                const { company } = res.rows
                titleBottom = company

                titleContent.company = JSON.parse(localStorage.getItem("loginInfo")).companyName
                titleContent.user = JSON.parse(localStorage.getItem("loginInfo")).phone
                titleContent.address = company.companyAdress
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


    var $p = `
        <p>${titleContent.user}</p>
        <p>${titleContent.address === undefined ? "--" : titleContent.address}</p>
    `




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



    $(".Realtime-left-top-content").append($p);
    $(".Realtime-left-top-title").html(`${titleContent.company}`);


    //监听提交搜索
    form.on('submit(submitBtn)', function (data) {

        table.reload('tableReload', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                location: data.field.location,
                deviceSmallType: typeId,
                state: state
            }
        });


        return false;
    });

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

    var $span = `
            <div>
                <p>
                    <span style="background-color: #1191da;"></span>
                    <p  class="first" style="color: #1191da;">总数：${titleBottom.deviceSum}</p>
                </p>
                <p>
                    <span style="background-color: #c82c1f;"></span>
                    <p style="color: #c82c1f;">报警：${titleBottom.deviceAlarm}</p>
                </p>
            </div>
            <div>
                <p>
                    <span style="background-color: #3bd83f;"></span>
                    <p  class="first" style="color: #3bd83f;">在线：${titleBottom.deviceOnLine}</p>
                </p>
                <p>
                    <span style="background-color: #75747c;"></span>
                    <p style="color: #75747c;">离线：${titleBottom.deviceOffLine}</p>
                </p>
            </div>
    `

    $(".Realtime-left-top-bottom").append($span);


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

    $(".wisdom-electricity-bottom-top-classify").append(
        `
        <p class="classifyStyle typeScreen"><span style="background: #1191da;"></span>全部 </p>
        <p class="typeScreen"><span style="background: #3bd83f;"></span> 正常 </p>
        <p class="typeScreen"><span style="background: #c82c1f"></span> 报警 </p> 
        <p class="typeScreen"><span style="background: #bf671d"></span> 故障 </p> 
        <p class="typeScreen"><span style="background: #75747c"></span> 离线 </p> 
        `
    )

    $(".wisdom-electricity-bottom-top-classify > p").on("click", function () {
        $(this).addClass("classifyStyle");
        $(this).siblings('p').removeClass('classifyStyle');
    });

    

    //初始化渲染全部类型

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

    table.render({
        elem: '#home',
        id: 'tableReload',
        height: 750,
        url: baseUrl + "/device/tablelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
        where: {
            state: state,
            companyId: localStorage.getItem('companyId')
        },
        limit: 15,
        limits: [15, 30, 50, 100, 200, 500, 1000],
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
            [ //表头
                {
                    field: 'type',
                    title: '设备状态',
                    align: "center",
                    width: 110,
                    templet: "#sexTpl",
                    sort: true
                },
                {
                    field: 'imei',
                    align: "center",
                    title: '设备编号',
                    width: 150,
                    event: "rowClick"
                },
                {
                    field: 'type',
                    title: '设备类型',
                    align: "center",
                    width: 150,
                    templet: "#typeSign"
                },
                {
                    field: 'typeSign',
                    title: 'typeSign',
                    align: "center",
                    width: 150
                },
                {
                    field: 'companyName',
                    align: "center",
                    title: '设备所属单位'
                },
                {
                    field: 'location',
                    align: "center",
                    title: '设备安装地点'
                },
                {
                    field: 'installationTime',
                    align: "center",
                    title: '安装时间',
                    width: 120,
                    sort: true
                },
                {
                    field: 'toxfTime',
                    align: "center",
                    title: '上传消防时间',
                    width: 150,
                    sort: true
                },
                JSON.parse(localStorage.getItem('loginInfo')).companyLevel !== 'user' ? {
                    fixed: 'right',
                    title: '操作',
                    align: "center",
                    width: 170,
                    toolbar: '#barDemo'
                } : ''
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

    table.on('rowDouble(tableTest)', function (obj) {
        let data = obj.data;
        if (data.deviceSmallType === '05') {
            $.ajax({
                url: baseUrl + "/video/info?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
                data: {
                    deviceId: data.id
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
                    layer.open({
                        type: 1,
                        shade: false,
                        title: false, //不显示标题
                        area: '880px', //宽高
                        content: `
                        <div id="video2" style="width: 100%; height: 500px;max-width: 880px;position: relative">
                            <live-player id="live-player" video-url=${res.rows.flvUrl} live="true" stretch="true" aspect='fullscreen' controls="true" hide-big-play-button="true"></live-player>
                        </div>
                        `
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
        } else {
            layer.open({
                type: 2,
                id: "iframe",
                skin: 'layui-layer-yingke',
                title: false,
                closeBtn: 0, //不显示关闭按钮
                title: '设备详情',
                shade: [0],
				offset:50,
                scrollbar: true,
                closeBtn: 1,
                area: ['70%', '81%'],
                shadeClose: true,
                anim: 0,
                content: [`../demo.html?id=${data.id}`, 'no'], //iframe的url，no代表不显示滚动条
            });
        }


    })
    //监听行单击事件（双击事件为：rowDouble）
    table.on('tool(tableTest)', function (obj) {
        let data = obj.data;

        // obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
        if (obj.event === 'del') {
            layer.prompt({
                title: '请输入密码进行权限验证',
                formType: 1,
            },
                function (pass, index) {
                    $.ajax({
                        url: baseUrl + "/device/delete?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
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
            // layer.confirm('真的删除行么', function (index) {
            //     obj.del();
            //     layer.close(index);
            // });
        } else if (obj.event === 'edit') {
            layer.open({
                type: 1,
                offset: '180px',
                title: '编辑设备',
                skin: 'layui-layer-yingke',
                area: ['900px', '500px'],
                content: $("#pop-up-add"),
                success: function (layero, index) {
                    $("#pop-up-add").html(
                        `
                <form class="layui-form" action="">
                <div class="layui-form-item">
                    <label class="layui-form-label">所属单位</label>
                    <div class="layui-input-block  layui-required">
                        <select name="companyId" lay-verify="required" lay-filter="companyId-select1" lay-search="">
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
                    <label class="layui-form-label layui-tips1">设备类型</label>
                    <div id="tySign"  class="layui-input-block">
                        <select name="typeSign" lay-verify="required" disabled lay-search="">
                            <option value=""></option>
                            ${deviceType.map(item => {
                            return `
                                    ${function () {
                                    if (item.typeSign === data.typeSign) {
                                        return `<option selected="true" value=${item.typeSign}>${item.typeName}</option>`
                                    } else {
                                        return `<option value=${item.typeSign}>${item.typeName}</option>`
                                    }
                                }()
                                }
                            `
                        })}
                            
                        </select>
						<i class="layui-icon layui-icon-tips layui-tips" lay-tips="如果类型选择错误，请联系管理员修改" ></i>
                    </div>
					
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">设备编号</label>
                    <div class="layui-input-block">
                        <input type="text" name="imei" lay-verify="imei" required disabled placeholder="请输入" autocomplete="off"
                            class="layui-input layui-disabled" value=${data.imei}>
						<i class="layui-icon layui-icon-tips layui-tips" lay-tips="设备编号不允许修改，如果输入错误，请删除此设备后重新添加" ></i>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">位置描述</label>
                    <div class="layui-input-block  layui-required">
                        <input type="text" name="location" lay-verify="address" required placeholder="请输入" autocomplete="off"
                            class="layui-input" value=${data.location}>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">所属建筑</label>
                    <div class="layui-input-block">
                        <select name="architectureId" id="architectureId-select1" lay-search="">
                            <option value=""></option>
                            ${
                                function () {
                                    let mapData = null
                                let url = baseUrl + "/architecture/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token + "&companyId=" + data.companyId;
                                $.ajax({
                                    url: url,
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
                                        else if(res.code ===200){
                                            mapData =  res.rows.map(item => {
                                                return `
                                                ${function () {
                                                    if (item.id === data.architectureId) {
                                                        return `<option selected="true" value=${item.id}>${item.architectureName}</option>`
                                                    } else {
                                                        return `<option value=${item.id}>${item.architectureName}</option>`
                                                    }
                                                }()}
                                                            `
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
                            return mapData.join("")
                        }()
                    }
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">所属楼层</label>
                    <div class="layui-input-block">
                        <select name="floor" lay-search="">
                            <option value=""></option>
                            ${function () {
                            var fllorNum = [] //楼层
                            for (var i = -3; i <= 20; i++) {
                                fllorNum.push(i)
                            }
                            return fllorNum.map(item => {
                                return `
                                    ${function () {
                                        if (item === data.floor) {
                                            return `<option selected="true" value=${item}>${item}</option>`
                                        } else {
                                            return `<option value=${item}>${item}</option>`
                                        }
                                    }()}
                                `
                            })
                        }()
                        }
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">物联网卡号</label>
                    <div class="layui-input-block">
                        <input type="text" name="iccid" placeholder="请输入" autocomplete="off" class="layui-input" value=${data.iccid}>
                    </div>
                </div>
				<div class="layui-form-item">
                    <label class="layui-form-label">水容器长度</label>
                    <div class="layui-input-block">
                        <input type="text" name="length" placeholder="水位设备必填" autocomplete="off" class="layui-input" value=${data.length}>
                    </div>
                </div>
				<div class="layui-form-item">
                    <label class="layui-form-label">水容器宽度</label>
                    <div class="layui-input-block">
                        <input type="text" name="width" placeholder="水位设备必填" autocomplete="off" class="layui-input" value=${data.width}>
                    </div>
                </div>
				<div class="layui-form-item">
                    <label class="layui-form-label">水容器高度</label>
                    <div class="layui-input-block">
                        <input type="text" name="height" placeholder="水位设备必填" autocomplete="off" class="layui-input" value=${data.height}>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">设备IOT-ID</label>
                    <div class="layui-input-block">
                        <input type="text" name="deviceId" placeholder="请输入" autocomplete="off" class="layui-input" value=${data.deviceId}>
                    </div>
                </div>
                <div class="layui-form-item" style="display: none">
                    <div class="layui-input-block">
                        <input type="text" name="id" placeholder="请输入" autocomplete="off" class="layui-input" value=${data.id}>
                    </div>
                </div>
                <div class="layui-form-item  layui-form-item-submit">
                    <div style="text-align:center">
                        <button type="submit" class="layui-btn" lay-submit lay-filter="update">确认</button>
						<button type="button" id="close-pop-up" class="layui-btn layui-btn-primary">取消</button>
                    </div>
                </div>
            </form>
            
        `
                    )
                    form.render();
                    $('*[lay-tips]').on('mouseenter', function () {
                        var content = $(this).attr('lay-tips');
                        this.index = layer.tips(content, this,
                            {
                                time: -1
                                //,maxWidth: 200
                                , tips: [4, '#000']
                            });
                    }).mouseleave(function () {
                        layer.closeAll('tips'); //关闭所有的tips层
                    })
                    //关闭弹层
                    $("#close-pop-up").click(function () {
                        layer.closeAll();
                    })
                    //验证
                    form.verify({
                        imei: [
                            /^[\S]{11,15}$/
                            , 'IEMI输入可能不正确请核对'
                        ],
                        address: function (value) {
                            if (value.length < 5) {
                                return '地址不够详细，至少得6个字';
                            }
                        }
                    });
                }
            });
        } else if (obj.event === 'sync') {
                    $.ajax({
                        url: '//newxf.yk-iot.cn/ctwing/auto_update_device.php?imei=' + data.imei,
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
                                    layer.alert(res.msg, {
                                        skin: 'layui-layer-yingke' //样式类名
                                        ,closeBtn: 0
										,icon: 6,
                                      })
                                }else {
                                    layer.alert(res.msg, {
                                        icon: 5,
										skin: 'layui-layer-yingke', //样式类名
                                        title: "设备实时状态检测",
                                        anim: 6, //动画类型
										//closeBtn: 0,
                                       // time: 3000
                                    });
                                }
                        }
                    })
        }
    });


    
    //获取建筑
    form.on('select(companyId-select)', function (data) {
        //data.value 得到被选中的值
        var url = baseUrl + "/architecture/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token + "&companyId=" + data.value;
        $.get(url, function (data) {
            $("#architectureId-select").empty();
            $("#architectureId-select").append(new Option("请选择建筑", ""));
            $.each(data.rows, function (index, item) {
                $("#architectureId-select").append(new Option(item.architectureName, item.id));
            });
            layui.form.render("select");
        });

    });

    form.on('select(companyId-select1)', function (data) {
        //data.value 得到被选中的值
        var url = baseUrl + "/architecture/list?token=" + JSON.parse(localStorage.getItem("loginInfo")).token + "&companyId=" + data.value;
        $.get(url, function (data) {
            $("#architectureId-select1").empty();
            $("#architectureId-select1").append(new Option("请选择建筑", ""));
            $.each(data.rows, function (index, item) {
                $("#architectureId-select1").append(new Option(item.architectureName, item.id));
            });
            layui.form.render("select");
        });

    });



    $(".wisdom-electricity-bottom-top-type > span").on("click", function () {
        $(this).addClass("classifyStyle");
        $(this).siblings('span').removeClass('classifyStyle');
    });


    for (var i = 0; i < $('.button-add').length; i++) {
        $('.button-add')[i].onclick = function () {
            layer.open({
                type: 1,
                offset: '180px',
                skin: 'layui-layer-yingke',
                title: '添加设备',
                area: '900px',
                content: $("#pop-up-add")
            });
        }
    }

    //新增设备提交
    form.on('submit(demo1)', function (data) {

        for (var i = 0; i < Object.keys(data.field).length; i++) {

            if (data.field[Object.keys(data.field)[i]].length === 0) {
                delete data.field[Object.keys(data.field)[i]]
            }
        }

        $.ajax({
            url: baseUrl + "/device/save?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify(data.field),
            contentType: "json/application",
            type: 'post',
            dataType: "json",
            success: function (res) {
                table.reload('tableReload', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    },
                    where: {
                        state: state,
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
                    layer.msg('设备添加成功', {
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

    //编辑设备提交
    form.on('submit(update)', function (data) {

        for (var i = 0; i < Object.keys(data.field).length; i++) {
            if (data.field[Object.keys(data.field)[i]].length === 0) {
                delete data.field[Object.keys(data.field)[i]]
            }
        }

        $.ajax({
            url: baseUrl + "/device/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
            data: JSON.stringify(data.field),
            contentType: "json/application",
            type: 'post',
            dataType: "json",
            success: function (res) {
                table.reload('tableReload', {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    },
                    where: {
                        state: state,
                        deviceSmallType: typeId
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
                    layer.msg('修改设备成功^_^', {
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