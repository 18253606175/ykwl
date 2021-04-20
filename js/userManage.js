layui.use(['element', 'layer', 'laydate'], function () {
    var $ = layui.jquery
    var laydate = layui.laydate;

    //添加
    $('.button-add').click(function () {
        layer.open({
            type: 1,
            offset: '180px',
            title: '添加单位',
            area: ['1000px', '450px'],
            content: $("#pop-up-add")
        });
    })


    //编辑
    $('.edit-btn').click(function () {
        layer.open({
            type: 1,
            offset: '180px',
            title: '添加单位',
            area: ['1000px', '450px'],
            content: $("#pop-up-add")
        });
    })

    laydate.render({
        elem: '#test4',
        type: 'datetime'
    });


    //删除

    $('.delete-btn').click(function () {
        //询问框
        layer.confirm('您确认要删除啊？', {
            btn: ['确认', '取消'] //按钮
        });
    })
})