layui.use(['element', 'layer', 'table', 'form'], function () {
    var $ = layui.jquery
    var element = layui.element;
    var table = layui.table;
    var form = layui.form

    //表格数据
    var tableData = [{
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        }

        ,
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        }

        ,
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        },
        {
            type: 1,
            imei: 4562
        }
    ]



    //点击刷新按钮
    $("#refresh").on('click', function () {

    })

    var typeId = 0
    //请求数据列表函数
    function getData(param) {
        table.render({
            elem: '#table',
            height: 710,
            url: "",
            where: {
                id: param
            },
            cellMinWidth: 85,
            page: true, //开启分页
            even: true,
            parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "data": res //解析数据列表
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
                        type: 'checkbox'
                    },
                    {
                        field: 'type',
                        title: '状态',
                        width: 60,
                        templet: "#sexTpl"
                    },
                    {
                        field: 'imei',
                        title: '设备编号'
                    },
                    {
                        field: 'deviceName',
                        title: '设备名称'
                    },
                    {
                        field: 'deviceName',
                        title: '设备类型'
                    },
                    {
                        field: 'location',
                        title: '设备安装地点'
                    },
                    {
                        field: 'createTime',
                        title: '设备安装时间'
                    },
                    {
                        fixed: 'right',
                        title: '操作',
                        width: 100,
                        align: 'center',
                        toolbar: '#barDemo'
                    }
                ]
            ]
        });
    }

    //初始化加载表格数据
    table.render({
        elem: '#table',
        height: 710,
        even: true,
        data: tableData,
        cellMinWidth: 85,
        page: true, //开启分页
        even: true,
        cols: [
            [ //表头
                {
                    type: 'checkbox'
                },
                {
                    field: 'type',
                    title: '状态',
                    width: 60,
                    templet: "#sexTpl"
                },
                {
                    field: 'imei',
                    title: '设备编号'
                },
                {
                    field: 'deviceName',
                    title: '设备名称'
                },
                {
                    field: 'deviceName',
                    title: '设备类型'
                },
                {
                    field: 'location',
                    title: '设备安装地点'
                },
                {
                    field: 'createTime',
                    title: '设备安装时间'
                },
                {
                    fixed: 'right',
                    title: '操作',
                    width: 100,
                    align: 'center',
                    toolbar: '#barDemo'
                }
            ]
        ]
    });
    // getData(typeId)
    //切换筛选状态

    for (var i = 0; i < $(".layui-tab-brief li").length; i++) {
        $(".layui-tab-brief li")[i].setAttribute("index", i);
        $(".layui-tab-brief li")[i].onclick = function () {

            typeId = Number(this.getAttribute("index"))
            getData(typeId)
        }
    }


    //监听提交搜索
    form.on('submit(submitBtn)', function (data) {

        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        })
        return false;
    });

    form.on('submit(submitDoubleBtn)', function (data) {

        layer.alert(JSON.stringify(data.field), {
            title: '最终的提交信息'
        })
        return false;
    });



})