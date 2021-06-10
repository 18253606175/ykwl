import {
    baseUrl
} from "./params.js";

layui.use(['element', 'layer'], function () {
    var $ = layui.jquery
    var element = layui.element;
    var layer = layui.layer;
    var layid = location.hash.replace(/^#test1=/, '');
    var projectView = {
        first: [{
                title: "单位总数",
                value: 1
            },
            {
                title: "报警总数",
                value: 1
            },    
            {
                title: "巡检点总数",
                value: 1
            }
        ],
        second: [{
                title: "设备总数",
                value: 1
            },
            {
                title: "已处理总数",
                value: 1
            },
            {
                title: "已巡检总数",
                value: 1
            }
        ]
    }

    //设备统计请求
    $.ajax({
        url: baseUrl + '/company/statistics?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
        async:false,
        success: function(res){
            const { rows } = res;
            projectView.first[0].value = rows.companyNum;
            projectView.first[1].value = rows.alarmNum;
            projectView.first[2].value = rows.inspectAddNum;
            projectView.second[0].value = rows.deviceNum;
        }
    })


    element.tabChange('test1', layid); //假设当前地址为：http://a.com#test1=222，那么选项卡会自动切换到“发送消息”这一项

    var deviceState = []

    //柱形图数据

    var columData = []

    //报警数据
    var alertData = []


    //报警分类
    var backwardData = []


    //近7日报警
    var weekAlarm = []


    //近7日报警统计
    $.ajax({
        url: baseUrl + '/alarm/alarmnumwithsevendate?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
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
            weekAlarm = rows.map(item => {
                return {
                    data: item.month,
                    value: item.count
                }
            }).reverse()




            var myChartS = echarts.init(document.getElementById('home-right-bottom-bottom'));


            var xData = []
            var line = [];
            var line2 = [];
            weekAlarm.map(item => {
                xData.push(item.data);
                line.push(item.value);
                line2.push(item.value2)
            })

            var colors = []
            var optionS = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {//设置右侧柱状图 位置 高度
                    left: '5%',
                    right: '5%',
                    bottom: '8%',
					height:235,
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: xData,
					axisTick: {
                            show: true//刻度
                        },
                }],
                yAxis: [ {
                        type: 'value',
                        //splitNumber: 10,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed',
                                color: '#D8D8D8'
                            }
                        },
                        axisLine: {
                            show: true//刻度
                        },
                        axisTick: {
                            show: true//刻度
                        },
                    }],
                series: [


                    {
                        name: '今日报警次数',
                        type: 'bar',
                        emphasis: {
                            focus: 'series'
                        },
						 label: {
                            show: true,
                            position: 'top',//数值位置insideRight
							textStyle: {	    //数值样式
                               color: '#ddd',//加个颜色 防止描边
                               fontSize: 12
                           }
						 },
						  itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{//渐变位置
                                    offset: 0,
                                    color: '#1b82a1' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'red' // 100% 处的颜色
                                }], false),
                            },
                        },
                        data: line
                    },
					
                ]
            };
            optionS && myChartS.setOption(optionS);
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

    // onSearch = (v) => {
    //     console.log(v);
    // }


    function circulation() {

        $.ajax({
            url: baseUrl + '/company/infoanddevicetype?token=' + JSON.parse(localStorage.getItem('loginInfo')).token + '&companyId=' + JSON.parse(localStorage.getItem('loginInfo')).companyId,
            success: function (res) {
                if(res.code === 20001){
                    layer.alert('登录已过期请重新登陆', {
                        skin: 'layui-layer-yingke' //样式类名
                        ,closeBtn: 0
                        }, function(){
                            parent.location.href = './index.html'
                        });
                } 
                else if(res.code = 200){
                    
                const {
                    deviceTypeNum,
                    company
                } = res.rows
                columData = deviceTypeNum.map(item => {
                    return {
                        name: item.type_sign,
                        value: item.count
                    }
                })



                deviceState = [{
                        name: "正常设备",
                        percent: (company.deviceOnLine / company.deviceSum *100).toFixed(2) + '%',
                        value: company.deviceOnLine
                    },
					{
                        name: "报警设备",
                        percent: (company.deviceAlarm / company.deviceSum *100).toFixed(2) + '%',
                        value: company.deviceAlarm
                    },
                    {
                        name: "故障设备",
                        percent: (company.deviceFault / company.deviceSum * 100).toFixed(2) + '%',
                        value: company.deviceFault
                    },
					
                    {
                        name: "离线设备",
                        percent: (company.deviceOffLine / company.deviceSum * 100).toFixed(2) + '%',
                        value: company.deviceOffLine
                    }
                ]

                //设备状态
                let num = 0;
                deviceState.map(item => {
                    num += item.value
                })
                let colorPie = ['green','red','yellow', 'grey'];
                let colorWrap = ["#1be5e7",'#1be5e7', "#1be5e7"];
                let baseDataPie = [],
                    baseDataWrap = [];
                for (var i = 0; i < deviceState.length; i++) {
                    baseDataPie.push({
                        value: deviceState[i].value,
                        name: deviceState[i].name,
                        itemStyle: {
                            normal: {
                                borderWidth: 10,

                                borderColor: colorPie[i],

                            }
                        }
                    });
                    baseDataWrap.push({
                        value: deviceState[i].value,
                        name: deviceState[i].name,
                        itemStyle: {
                            normal: {
                                color: colorWrap[i],
                                borderWidth: 10,
                                borderColor: colorWrap[i],
                                shadowBlur: 50,
                                shadowColor: 'rgba(48, 135, 214, 0.3)',
                            }
                        }
                    }, {
                        value: 10,
                        name: '',
                        itemStyle: {
                            normal: {
                                color: 'transparent',
                                borderWidth: 10,
                                borderColor: 'transparent',

                            }
                        }
                    });
                }
                var getmydmc = []; //y
                var getmyd = []; //x
                columData.map(item => {
                    getmydmc.push(item.name);
                    getmyd.push(item.value)
                })

                var getmydzd = [];
                for (let i = 0; i < getmyd.length; i++) {
                    getmydzd.push(10000)
                }
                //计算最大值  
                function calMax(arr) {
                    let max = 0;
                    arr.forEach((el) => {
                        el.forEach((el1) => {
                            if (!(el1 === undefined || el1 === '')) {
                                if (max < el1) {
                                    max = el1;
                                }
                            }
                        })
                    })
                    let maxint = Math.ceil(max / 9.5);
                    //不让最高的值超过最上面的刻度    
                    let maxval = maxint * 10;
                    //让显示的刻度是整数    
                    return maxval;
                }


                var max = Math.ceil(calMax([getmyd]) / 10) * 10;
                var myChart = echarts.init(document.getElementById('home-left-center-bottom-left'));
                var myChartT = echarts.init(document.getElementById('home-left-bottom'));

                // 柱形绘制图表
                var option = {
                    title: {
                        text: '总数',
                        subtext: num,
                        textStyle: {
                            color: '#00b5f3',
                            fontSize: 12,

                        },
                        subtextStyle: {
                            align: 'center',
                            fontSize: 18,
                            color: ['#85c7e3'],
                            fontWeight: 800
                        },
                        x: '38%',
                        y: '40%',
                    },
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{a}{b} <br/>占比：{d}%"
                    },

                    grid: {
                        left: '1%', // 与容器左侧的距离
                        right: '1%', // 与容器右侧的距离
                        top: '1%', // 与容器顶部的距离
                        bottom: '1%', // 与容器底部的距离

                    },
                    series: [{
                            name: '',
                            type: 'pie',
                            clockWise: false, //顺时加载
                            hoverAnimation: false, //鼠标移入变大
                            center: ['50%', '50%'],
                            radius: ['80%', '81%'],
                            tooltip: {
                                show: false
                            },
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            data: baseDataWrap
                        },
                        {

                            name: '',
                            type: 'pie',
                            color: colorPie,
                            selectedMode: 'single',
                            radius: ['55%', '58%'],
                            center: ['50%', '50%'],
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false,
                                }
                            },

                            data: baseDataPie
                        },

                    ]
                };

                //条形绘制图表

                var optionT = {
                    grid: {//设置右侧柱状图 位置 高度
                    left: '5%',
                    right: '9%',
                    bottom: '6%',
					height:240,
                    containLabel: true
                },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'none'
                        },
                        formatter: function (params) {
                            return params[0].name + ': ' + params[0].value
                        }
                    },
                    xAxis: [{
                        type: 'value',
                        axisLabel: {
                            margin: 5,
                            color: '#999',
                            textStyle: {
                                fontSize: '13'
                            },
                        },
                        min: 0,
                        max: max, // 计算最大值
                        interval: max / 5, //  平均分为5份
                        splitNumber: 5,
                        splitLine: {
                            show: true,
                            lineStyle: {

                                color: '#D8D8D8'
                            }
                        },
                        axisLine: {
                            show: true
                        },
                        axisTick: {
                            show: true
                        },
                    }, {
                        type: 'value',
                        axisLabel: {
                            show: false,
                        },
                        min: 0,
                        max: max, // 计算最大值
                        interval: max / 10, //  平均分为5份
                        splitNumber: 10,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed',
                                color: '#D8D8D8'
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: true
                        },
                    }],
                    yAxis: [{
                        type: 'category',
                        inverse: true,
                        axisLabel: {
                            textStyle: {
                                color: '#999',
                                fontSize: '13'
                            },
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#8E8E8E'
                            }
                        },
                        data: getmydmc
                    }],
                    series: [{
                        name: '值',
                        type: 'bar',
                        zlevel: 1,
                        xAxisIndex: 0,
                        label: {
                            show: true,
                            position: 'right',//数值位置insideRight
							textStyle: {	    //数值样式
                               color: '#ddd',//加个颜色 防止描边
                               fontSize: 12
                           }

                        },
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                    offset: 0,
                                    color: '#1b82a1' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#1b82a1' // 100% 处的颜色
                                }], false),
                            },
                        },
                        barWidth: 20,//柱宽度
                        data: getmyd
                    }, ]
                };

                option && myChart.setOption(option);
                optionT && myChartT.setOption(optionT);

                const device = deviceState.map(item => {
                    return `
                        <div class="home-left-center-bottom-right-top">
                            <div class="home-left-center-bottom-right-top-header">
                                <span></span>
                                <span>${item.name}</span>
                                <span>占比</span>
                            </div>
                            <div class="home-left-center-bottom-right-top-footer">
                                <span>${item.value}</span>
                                <span>${item.percent}</span>
                            </div>
                        </div>
                    `
                })

                document.getElementsByClassName("home-left-center-bottom-right")[0].innerHTML = device.join('');
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


        var first = projectView.first.map(item => {
            return `
                <div>
                    <span>${item.title}</span>
                    <span>${item.value}</span>
                </div>
                `
        })

        var second = projectView.second.map(item => {
            return `
                <div>
                    <span>${item.title}</span>
                    <span>${item.value}</span>
                </div>
                `
        })




        //当月设备报警
        $.ajax({
            url: baseUrl + '/alarm/listwithmonth?token=' + JSON.parse(localStorage.getItem('loginInfo')).token,
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
                    alertData = rows.map(item => {
                        return {
                            title: item.location,
                            num: item.alarmTime,
                            name: item.alarmMessage+':'+item.alarmData+item.data_unit,
                            describe: item.isSolve === 0 ? '处理' : '未处理'
                        }
                    })
                    const alert = alertData.map(item => {
                        return `
                            <li>
                                <span class="mess-span-index">${item.title}</span>
                                <span class="time-span-index">${item.num}</span>
                                <br />
                                <span class="cause-span-index">${item.name}</span>
                                <span class="state-span-index">${item.describe}</span>
                            </li>
                        `
                    })
                    document.getElementsByClassName("home-center-bottom-bottom-content")[0].innerHTML = alert.join('');
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



        //报警分类
        $.ajax({
            url: baseUrl + '/alarm/numbyalarmtype?token=' + JSON.parse(localStorage.getItem('loginInfo')).token + '&companyId=' + JSON.parse(localStorage.getItem('loginInfo')).companyId,
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
                    for (var i in rows) {
                        var pre = rows[i] / rows[Object.keys(rows).pop()] * 100
                        var backwardObj = {
                            name: i,
                            value: rows[i],
                            percent: pre.toFixed(2) + '%'
                        }
                        backwardData.push(backwardObj)
    
                    }
                    backwardData.pop()
    
                    var compare = function (obj1, obj2) {
                        var val1 = obj1.value;
                        var val2 = obj2.value;
                        if (val1 < val2) {
                            return 1;
                        } else if (val1 > val2) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                    backwardData.sort(compare)
    
                    const backward = backwardData.map(item => {
                        return `
                            <div class="home-left-center-bottom-right-top">
                                <div class="home-left-center-bottom-right-top-header">
                                    <span></span>
                                    <span>${item.name}</span>
                                    <span>占比</span>
                                </div>
                                <div class="home-left-center-bottom-right-top-footer">
                                    <span>${item.value}</span>
                                    <span>${item.percent}</span>
                                </div>
                                <div class="progressBar">
                                    <div class="progress-bar" style="width: ${item.percent}">
            
                                    </div>
                                </div>
                            </div>
                        `
                    })
                    document.getElementsByClassName("home-right-top-bottom")[0].innerHTML = backward.join('');
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
        document.getElementsByClassName("home-left-top-bottom-top")[0].innerHTML = first.join('');
        document.getElementsByClassName("home-left-top-bottom-bottom")[0].innerHTML = second.join('');
    }
    circulation()

    //监听Tab切换，以改变地址hash值

    var layid = location.hash.replace(/^#test=/, '');
    element.tabChange('demo', layid);

    element.on('tab(demo)', function (elem) {
        location.hash = 'test1=' + this.getAttribute('lay-id');

    });

    // 传入的 t 为滚动快慢的时间
    let ul1 = document.getElementById("ul1");
    let ul2 = document.getElementById("ul2");
    let box = document.getElementById("scrollContent");

    function roll(t) {


        ul2.innerHTML = ul1.innerHTML;
        // 初始化滚动高度
        box.scrollTop = 0;
        let timer = setInterval(rollStart, t);
        box.onmouseover = function () {
            clearInterval(timer)
        }
        box.onmouseout = function () {
            timer = setInterval(rollStart, t);
        }
    }

    function rollStart() {
        if (box.scrollTop >= ul1.scrollHeight) {
            box.scrollTop = 0;
        } else {
            box.scrollTop++;
        }
    }

    roll(50);



});