layui.use(['element', 'layer'], function () {
  var $ = layui.jquery
  var form = layui.form
  var table = layui.table;

  var dataTable = [{
      id: 1,
      sex: 'aa'
    },
    {
      id: 1,
      sex: 'aa'
    },
    {
      id: 1,
      sex: 'aa'
    },
    {
      id: 1,
      sex: 'aa'
    },
  ]

  //表格
  table.render({
    elem: '#unitTable',
    url: '',
    data: dataTable,
    page: true,
    height: 770,
    cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
      ,
    cols: [
      [{
          field: 'id',
          width: 80,
          title: 'ID'
        }, {
          field: 'username',
          width: 80,
          title: '用户名'
        }, {
          field: 'sex',
          width: 80,
          title: '性别'
        }, {
          field: 'city',
          width: 80,
          title: '城市'
        }, {
          field: 'sign',
          title: '签名',
          width: '30%',
          minWidth: 100
        } //minWidth：局部定义当前单元格的最小宽度，layui 2.2.1 新增
        , {
          field: 'experience',
          title: '积分'
        }, {
          field: 'score',
          title: '评分'
        }, {
          field: 'classify',
          title: '职业'
        }, {
          field: 'wealth',
          width: 137,
          title: '财富'
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