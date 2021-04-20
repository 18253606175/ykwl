layui.use(['element', 'layer', 'form', 'table', 'layedit', 'laydate'], function () {
  var $ = layui.jquery
  var element = layui.element;
  var form = layui.form,
    layer = layui.layer,
    layedit = layui.layedit,
    laydate = layui.laydate;
  var table = layui.table;

  laydate.render({
    elem: '#date'
  });
  laydate.render({
    elem: '#date1'
  });

  // for(var i=0; i< $(".site-demo-active").length; i++){
  //     $(".site-demo-active")[i].setAttribute("index", i)
  //     $(".site-demo-active")[i].onclick = function(){
  //        for(var j=0; j < $(".layui-tab-item > div").length; j++){
  //         $(".layui-tab-item > div")[j].className = "";
  //        }
  //        $(".layui-tab-item > div")[this.getAttribute("index")].className = "current";
  //     }
  // }

  table.render({
    elem: '#test',
    url: '/demo/table/user/',
    cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
      ,
    cols: [
      [{
          field: 'id',
          title: 'ID',
          sort: true
        }, {
          field: 'username',
          title: '用户名'
        } //width 支持：数字、百分比和不填写。你还可以通过 minWidth 参数局部定义当前单元格的最小宽度，layui 2.2.1 新增
        , {
          field: 'sex',
          title: '性别',
          sort: true
        }, {
          field: 'city',
          title: '城市'
        }, {
          field: 'sign',
          title: '签名'
        }, {
          field: 'classify',
          title: '职业',
          align: 'center'
        } //单元格内容水平居中
        , {
          field: 'experience',
          title: '积分',
          sort: true,
          align: 'right'
        } //单元格内容水平居中
        , {
          field: 'score',
          title: '评分',
          sort: true,
          align: 'right'
        }, {
          field: 'wealth',
          title: '财富',
          sort: true,
          align: 'right'
        }
      ]
    ]
  });

  const projectTitle = [{
      title: '温湿度',
      flag: true
    },
    {
      title: '无线测温'
    },
    {
      title: '故障电弧'
    },
    {
      title: 'arcm300仪表'
    },
    {
      title: '限流式保护器'
    },
    {
      title: '演示'
    },
  ]

  const projectF = projectTitle.map(item => {
    return `
        <li class="layui-nav-item ${item.flag ? 'layui-this' : ""}"><a href="javaScript:;">${item.title}</a></li>
        `
  })
  $(".electric-left > .layui-nav").append(projectF.join(""));
  $(".electric-left > .layui-nav > li").on("click", function () {
    $(this).addClass("layui-this");
    $(this).siblings('li').removeClass('layui-this');
  });

  form.on('submit(formDemo)', function (data) {
    layer.alert(JSON.stringify(data.field), {
      title: '最终的提交信息'
    })
    return false;
  });

})