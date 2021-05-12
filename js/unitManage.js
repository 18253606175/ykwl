import {
  baseUrl
} from '../js/params.js'
layui.use(['element', 'layer'], function () {
  var $ = layui.jquery
  var form = layui.form
  var table = layui.table;
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

  //表格
  table.render({
    elem: '#unitTable',
    id: 'tableReload',
    url: baseUrl + "/company/list?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
    height: 770,
    limit: 15,
    limits: [15, 30, 45],
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
          title: '公司id'
        }, {
          field: 'comID',
          align: "center",
          title: '消防单位id'
        }, {
          field: 'companyName',
          align: "center",
          title: '公司名称'
        }, {
          field: 'companyAddress',
          align: "center",
          title: '地址'
        }, {
          field: 'companyArea',
          align: "center",
          title: '区域'
        }, {
          field: 'fireConLevel',
          align: "center",
          title: '消防等级',
          templet: "#fireConLevel"
        }, {
          field: 'companyLevel',
          title: '单位等级',
          align: "center",
          templet: "#companyLevel"
        } //minWidth：局部定义当前单元格的最小宽度，layui 2.2.1 新增
        , {
          field: 'companyScore',
          align: "center",
          title: '消防评分'
        },{
          field: 'alarmTel',
          align: "center",
          title: '电话'
        }
      ]
    ]
  });

  //点击添加按钮
  $('.button-add').click(function () {
    layer.open({
      type: 1,
      offset: '180px',
      title: '添加单位',
      area: ['1000px', '450px'],
      content: $("#pop-up-add")
    });
  })


  //监听提交
  form.on('submit(demo1)', function (data) {
    layer.alert(JSON.stringify(data.field), {
      title: '最终的提交信息'
    })
    return false;
  });

  //关闭弹层
  $("#close-pop-up").click(function () {
    layer.closeAll();
  })

})