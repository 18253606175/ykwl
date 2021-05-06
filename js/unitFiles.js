layui.use(['element', 'layer'], function () {
    var $ = layui.jquery
    var myChart = echarts.init(document.getElementById('echars-score'));
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        series: [{
            name: '',
            type: 'pie',
            radius: '90%',
            center: ['50%', '50%'],
            data: [{
                    value: 335,
                    name: '分数',
                    itemStyle: {
                        color: '#ffa800'
                    }
                },
                {
                    value: 310,
                    name: '扣分',
                    itemStyle: {
                        color: '#b250ff'
                    }
                }
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                    label: {
                        show: false //隐藏标示文字
                    },
                    labelLine: {
                        show: false //隐藏标示线
                    }
                }
            }
        }]
    };
    option && myChart.setOption(option);


    // $('.projectDes-main-content').append(`<p>消防安全管理人电话：${localStorage.getItem('aaa')}</p>`)
})