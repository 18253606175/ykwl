import {
  baseUrl
} from '../js/params.js'
layui.use(['element', 'layer'], function () {
  var $ = layui.jquery
  var form = layui.form
  var table = layui.table;
  var tree = layui.tree;
  //下拉框value
  var selectDate = [
    {
      title: "没有选项",
      value: ""
    }
  ]

  var selectList = []
  var selectList1 = []

  //单位等级
  var companyLevel = [
	{
      title: '消防联网单位',
      value: 'user'
    },
	{
      title: '消防运营商',
      value: 'agent'
    },
	{
      title: '系统管理员',
      value: 'admin'
    }	
  ]

  //消防等级
  var fireConLevel = [
    {
      title: '消防重点单位',
      value: '01'
    },
    {
      title: '消防一般单位',
      value: '02'
    }
  ]

  //单位类别
  var companyType = [
    {
      title: '企业',
      value: '企业'
    },
	{
      title: '医院',
      value: '医院'
    },
    {
      title: '学校',
      value: '学校'
    },
	{
      title: '加油站',
      value: '加油站'
    },
	{
      title: '机关单位',
      value: '机关单位'
    },
	{
      title: '娱乐场所',
      value: '娱乐场所'
    }
	
  ]

  var a = ['admin', 'agent']
  //树形列表
  var treeData = []

  //树形结构ajax
  $.ajax({
      url: baseUrl + '/company/listtree?token=' + JSON.parse(localStorage.getItem("loginInfo")).token,
      async: false,
      success: function (res) {
        console.log(res)
        treeData = function(){
          return [{
            title: res.rows.companyName,
            id: res.rows.id,
            spread: true,
            children: res.rows.companyVOS.map(item => {
              return {
                  title: item.companyName,
                  id: item.id,
                  spread: false,//节点关闭
                  children: item.companyVOS.length !==0 ? item.companyVOS.map(value => {
                    return {
                        title: value.companyName,
                        id: value.id,
                        spread: true,
                      }
                  }) : []
              }
            })
          }]
        }()
          
          console.log(treeData)
      }
  })
  
  var id = null;
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
                companyId: id
              }
          });
      }
  })

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
  $.ajax({
    url: baseUrl + "/company/ztreelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
    async: false,
    traditional: true,
    dataType:"json",
    data: {
      type: 1
    },
    success: function (res) {
      selectList1 = res.rows
      form.render();
    }
  })

  //表格
  table.render({
    elem: '#unitTable',
    id: 'tableReload',
    url: baseUrl + "/company/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
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
        title: '公司ID',
		width:100,
		sort: true
      },{
        field: 'comID',
        align: "center",
        title: '消防ID',
		width:100,
		sort: true
      }, {
        field: 'companyName',
        align: "center",
        title: '公司名称'
      },  {
        field: 'companyType',
        align: "center",
        title: '单位类别',
		width:140,
      }, {
        field: 'fireConLevel',
        align: "center",
        title: '消防等级',
		width:140,
        templet: "#fireConLevel"
      }, {
        field: 'companyLevel',
        title: '单位等级',
        align: "center",
		width:140,
        templet: "#companyLevel",
		sort:true
      } //minWidth：局部定义当前单元格的最小宽度，layui 2.2.1 新增
        , {
        field: 'companyScore',
        align: "center",
        title: '消防评分',
		width:120,
		sort: true
      }, {
        field: 'alarmTel',
        align: "center",
        title: '电话',
		width:120
      }, {
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
    console.log(data)
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
        title: '添加单位',
        area: '900px',
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
              <label class="layui-form-label layui-required">所属经销商</label>
              <div class="layui-input-block">
                  <select name="companyPId" lay-search="" lay-verify="required">
                    <option value="">请选择单位</option>
                    ${selectList1.map(item => {
                          return `
                                    <option value=${item.id}>${item.companyName}</option>
                                  `
                      })}
                  </select>
              </div>
          </div>
      <div class="layui-form-item">
              <label class="layui-form-label layui-required">单位等级</label>
              <div class="layui-input-block">
                  <select name="companyLevel" lay-search="" lay-verify="required">
                      <option value=""></option>
                      ${companyLevel.map(item=>{
              return `${function(){
              
                return `<option value=${item.value}>${item.title}</option>`
              
              }()}`
              })}
                  </select>
              </div>
          </div>
          <div class="layui-form-item">
              <label class="layui-form-label layui-required">单位名称</label>
              <div class="layui-input-block">
                  <input id="keyword" type="text" name="companyName" lay-verify="required" placeholder="请输入单位名称" autocomplete="off"
                      class="layui-input" onBlur="ConvertName()">
			  <i class="layui-icon layui-icon-tips layui-tips" lay-tips="必填" ></i>				
              </div>
          </div>
          <div class="layui-form-item">
              <label class="layui-form-label layui-required">初始用户</label>
              <div class="layui-input-block">
                  <input type="text" name="userName" placeholder="根据单位名称可自动获得" autocomplete="off"
                      class="layui-input"  id="simply">
              </div>
          </div>
      <div class="layui-form-item">
              <label class="layui-form-label layui-required">消防等级</label>
              <div class="layui-input-block">
                  <select name="fireConLevel" lay-search="">
                      <option value=""></option>
                      ${fireConLevel.map(item=>{
              return `${function(){                                 
                return `<option value=${item.value}>${item.title}</option>`
              }()}`
              })}
                  </select>
              </div>
          </div>
      <div class="layui-form-item">
              <label class="layui-form-label layui-required">单位类别</label>
              <div class="layui-input-block">
                  <select name="companyType" lay-search="">
                      <option value=""></option>
                      ${companyType.map(item=>{
              return `${function(){                              
                return `<option value=${item.value}>${item.title}</option>`
              }()}`
              })}
                  </select>
              </div>
          </div>
          <div class="layui-form-item">
              <label class="layui-form-label layui-required">单位地址</label>
              <div class="layui-input-block">
                  <input id="map" type="text" name="companyAddress" placeholder="请选择" autocomplete="off"
                      class="layui-input">
              </div>
          </div>
          <div class="layui-form-item">
              <label class="layui-form-label layui-required">单位坐标</label>
              <div class="layui-input-block">
                  <input id="areaCode" type="text" name="areasCode" readonly placeholder="根据地址自动获取" autocomplete="off"
                      class="layui-input">
				 <i class="layui-icon layui-icon-tips layui-tips" lay-tips="请在地图选择单位地址 自动获取经纬度" ></i>		  
              </div>
          </div>
          
          <div class="layui-form-item" style="display: none">
              <label class="layui-form-label layui-required">单位区域</label>
              <div class="layui-input-block">
                  <input id="area" type="text" name="companyArea" placeholder="请输入" autocomplete="off"
                      class="layui-input">
              </div>
          </div>
          
        
          <div class="layui-form-item">
              <label class="layui-form-label layui-required">消防负责人</label>
              <div class="layui-input-block">
                  <input type="text" name="fireconperson" placeholder="请输入" autocomplete="off"
                      class="layui-input">
              </div>
          </div>
          <div class="layui-form-item">
              <label class="layui-form-label layui-required">负责人电话</label>
              <div class="layui-input-block">
                  <input type="text" name="AlarmTel" placeholder="请输入" autocomplete="off"
                      class="layui-input">
              </div>
          </div>
          <div class="layui-form-item">
              <label class="layui-form-label layui-required">消防支队ID</label>
              <div class="layui-input-block">
                  <input type="text" name="ComID" placeholder="请输入" autocomplete="off"
                      class="layui-input">
				<i class="layui-icon layui-icon-tips layui-tips" lay-tips="必填：单位在支队消防平台的ID" ></i>		  
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
 $('*[lay-tips]').on('mouseenter', function(){
				var content = $(this).attr('lay-tips');
				this.index = layer.tips(content, this,
				{
				time: -1
				//,maxWidth: 200
				,tips: [4, '#000']
				});
			}).mouseleave(function(){
				layer.closeAll('tips'); //关闭所有的tips层
			})
    $("#close-pop-up").click(function () {
      layer.closeAll();
    })
    //百度地图
    $("#map").focus(function () {
      layer.open({
        id: "HomeForm",
        type: 2,
        title: '百度地图',
        shadeClose: true,
        shade: 0.8,
        area: ['50%', '70%'],
        content: '../map.html', //iframe的url
      });
    })
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
          url: baseUrl + "/company/delete?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
          contentType: "application/json",
          data: JSON.stringify({
            companyId: data.id,

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
      }, function(){
      });
          
    } else if (obj.event === 'edit') {
      layer.open({
        type: 1,
        offset: '180px',
        title: '编辑单位',
        skin: 'layui-layer-yingke',
        area: '900px',
        content: $("#pop-up-add"),
        success: function (layero, index) {
          $("#pop-up-add").html(
            `
                  <form class="layui-form" action="">
                      
                    <div class="layui-form-item">
                        <label class="layui-form-label layui-required">所属经销商</label>
                        <div class="layui-input-block">
                          <select name="companyPId" lay-search="" lay-verify="required">
                            <option value="">请选择单位</option>
                            ${selectList1.map(item => {
                              return `
                                  ${function () {
                                      if (item.id === data.companyPId) {
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
                        <label class="layui-form-label layui-required">单位等级</label>
                        <div class="layui-input-block">
                            <select name="companyLevel" lay-search="" lay-verify="required">
                                <option value=""></option>
                                ${companyLevel.map(item=>{
                                  return `${function(){
                                    if (item.value === data.companyLevel) {
                                      return `<option selected="true" value=${item.value}>${item.title}</option>`
                                  } else {
                                      return `<option value=${item.value}>${item.title}</option>`
                                  }
                                  }()}`
                                })}
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label layui-required">单位名称</label>
                        <div class="layui-input-block">
                            <input type="text" name="companyName" lay-verify="required" placeholder="请输入" autocomplete="off"
                                class="layui-input" value=${data.companyName}>
							<i class="layui-icon layui-icon-tips layui-tips" lay-tips="必填" ></i>		
                        </div>
                    </div>
            <div class="layui-form-item">
            <label class="layui-form-label layui-required">初始用户</label>
            <div class="layui-input-block">
              <input type="text" name="userName" value=${data.userName} placeholder="请输入" autocomplete="off"
                class="layui-input">
            </div>
            </div>
                    
                    <div class="layui-form-item">
                        <label class="layui-form-label layui-required">消防等级</label>
                        <div class="layui-input-block">
                            <select name="fireConLevel" lay-search="">
                                <option value=""></option>
                                ${fireConLevel.map(item=>{
                                  return `${function(){
                                    if (item.value === data.fireConLevel) {
                                      return `<option selected="true" value=${item.value}>${item.title}</option>`
                                  } else {
                                      return `<option value=${item.value}>${item.title}</option>`
                                  }
                                  }()}`
                                })}
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item" style="display:none">
                        <label class="layui-form-label layui-required">单位区域</label>
                        <div class="layui-input-block">
                            <input id="area" type="text" name="companyArea" placeholder="请输入" autocomplete="off"
                                class="layui-input" value=${data.companyArea}>
                        </div>
                    </div>
					<div class="layui-form-item" style="display:none">
                        <label class="layui-form-label layui-required">单位ID</label>
                        <div class="layui-input-block">
                            <input  type="text" name="id" placeholder="请输入" autocomplete="off"
                                class="layui-input" value=${data.id}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label layui-required">单位类别</label>
                        <div class="layui-input-block">
                            <select name="companyType" lay-search="">
                                <option value=""></option>
                                ${companyType.map(item=>{
                                  return `${function(){
                                    if (item.value === data.companyType) {
                                      return `<option selected="true" value=${item.value}>${item.title}</option>`
                                  } else {
                                      return `<option value=${item.value}>${item.title}</option>`
                                  }
                                  }()}`
                                })}
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label layui-required">单位地址</label>
                        <div class="layui-input-block">
                            <input id="map" type="text" name="companyAddress" placeholder="请选择" autocomplete="off"
                                class="layui-input" value=${data.companyAddress}>
                        </div>
                    </div>
                  <div class="layui-form-item">
                        <label class="layui-form-label layui-required">单位坐标</label>
                        <div class="layui-input-block">
                            <input id="areaCode" type="text" name="areasCode" readonly placeholder="根据地址自动获取" autocomplete="off"
                                class="layui-input" value=${data.areasCode}>
							<i class="layui-icon layui-icon-tips layui-tips" lay-tips="请在地图选择单位地址 自动获取经纬度" ></i>	  
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label layui-required">消防负责人</label>
                        <div class="layui-input-block">
                            <input type="text" name="fireconperson" placeholder="请输入" autocomplete="off"
                                class="layui-input" value=${data.fireconperson}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label layui-required">负责人电话</label>
                        <div class="layui-input-block">
                            <input type="text" name="AlarmTel" placeholder="请输入" autocomplete="off"
                                class="layui-input" value=${data.alarmTel}>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label layui-required">消防支队ID</label>
                        <div class="layui-input-block">
                            <input type="text" name="ComID" placeholder="请输入" autocomplete="off"
                                class="layui-input" value=${data.comID}>
							<i class="layui-icon layui-icon-tips layui-tips" lay-tips="必填：单位在支队消防平台的ID" ></i>	 
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
          //关闭弹层
		  $('*[lay-tips]').on('mouseenter', function(){
				var content = $(this).attr('lay-tips');
				this.index = layer.tips(content, this,
				{
				time: -1
				//,maxWidth: 200
				,tips: [4, '#000']
				});
			}).mouseleave(function(){
				layer.closeAll('tips'); //关闭所有的tips层
			})
          $("#close-pop-up").click(function () {
            layer.closeAll();
          })
          //百度地图
          $("#map").focus(function () {
            layer.open({
              id: "HomeForm",
              type: 2,
              title: '百度地图',
              shadeClose: true,
              shade: 0.8,
              area: ['50%', '70%'],
              content: '../map.html', //iframe的url
            });
          })
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
      url: baseUrl + "/company/update?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
      data: JSON.stringify(data.field),
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


  //监听提交
  form.on('submit(save)', function (data) {
    $.ajax({
      url: baseUrl + "/company/save?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
      data: JSON.stringify(data.field),
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