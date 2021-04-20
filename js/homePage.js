layui.use(['element', 'layer'], function () {
    var $ = layui.jquery
    var element = layui.element;
    var layer = layui.layer;
    var layid = location.hash.replace(/^#test1=/, '');
    var projectView = {
        first: [{
                title: "项目总数",
                value: 1
            },
            {
                title: "设备总数",
                value: 1
            },
            {
                title: "巡检次数",
                value: 1
            }
        ],
        second: [{
                title: "报警总数",
                value: 1
            },
            {
                title: "已解决总数",
                value: 1
            },
            {
                title: "未解决总数",
                value: 1
            }
        ]
    }
    var alarmData = {
        "proNum": 1,
        "devNum": 22
    }

    var projectData = [{
            title: "A Title",
            value: "山东英科物联网",
            money: "$20"
        },
        {
            title: "B Title",
            value: "山东英科物联网",
            money: "$10"
        },
        {
            title: "Title",
            value: "山东英科物联网",
            money: "$20"
        },
        {
            title: "Title",
            value: "山东英科物联网",
            money: "$20"
        },
        {
            title: "Title",
            value: "山东英科物联网",
            money: "$20"
        },
        {
            title: "Title",
            value: "山东英科物联网",
            money: "$20"
        },
        {
            title: "Title",
            value: "山东英科物联网",
            money: "$20"
        },
        {
            title: "Title",
            value: "山东英科物联网",
            money: "$20"
        },
        {
            title: "Title",
            value: "山东英科物联网",
            money: "$20"
        }
    ]
    element.tabChange('test1', layid); //假设当前地址为：http://a.com#test1=222，那么选项卡会自动切换到“发送消息”这一项


    var deviceState = [{
            name: "正常设备",
            percent: "10",
            value: 10
        },
        {
            name: "报警设备",
            percent: "10",
            value: 10
        },
        {
            name: "离线设备",
            percent: "10",
            value: 10
        }
    ]

    //柱形图数据

    var columData = [{
            name: "外地开会",
            value: 10
        },
        {
            name: "外地开会",
            value: 20
        },
        {
            name: "外地开会",
            value: 30
        },
        {
            name: "外地开会",
            value: 40
        },
        {
            name: "外地开会",
            value: 50
        },
        {
            name: "外地开会",
            value: 60
        },
    ]

    //报警数据
    var alertData = [{
            title: "aa",
            num: "123",
            name: "bb",
            describe: "未派发"
        },
        {
            title: "aa",
            num: "123",
            name: "bb",
            describe: "未派发"
        },
        {
            title: "aa",
            num: "123",
            name: "bb",
            describe: "未派发"
        },
        {
            title: "aa",
            num: "123",
            name: "bb",
            describe: "未派发"
        },
        {
            title: "aa",
            num: "123",
            name: "bb",
            describe: "未派发"
        },
        {
            title: "aa",
            num: "123",
            name: "bb",
            describe: "未派发"
        },
        {
            title: "aa",
            num: "123",
            name: "bb",
            describe: "未派发"
        },
        {
            title: "aa",
            num: "123",
            name: "bb",
            describe: "未派发"
        },
        {
            title: "aa",
            num: "123",
            name: "bb",
            describe: "未派发"
        },
    ]


    //报警分类
    var backwardData = [{
            name: "隐患",
            percent: "10%",
            value: 10
        },
        {
            name: "报警",
            percent: "10%",
            value: 10
        },
        {
            name: "事故",
            percent: "10%",
            value: 10
        },
        {
            name: "故障",
            percent: "10%",
            value: 10
        }
    ]


    //近7日报警
    var weekAlarm = [{
            data: "3-11",
            value: 123,
            value2: 22
        },
        {
            data: "3-12",
            value: 123,
            value2: 22
        },
        {
            data: "3-13",
            value: 123,
            value2: 22
        },
        {
            data: "3-14",
            value: 123,
            value2: 22
        },
        {
            data: "3-15",
            value: 123,
            value2: 22
        },
        {
            data: "3-16",
            value: 123,
            value2: 22
        },
        {
            data: "3-17",
            value: 123,
            value2: 22
        },
    ]

    onSearch = (v) => {
        console.log(v);
    }

    let num = 0;
    deviceState.map(item => {
        num += item.value
    })
    let colorPie = ['blue', 'yellow', 'green'];
    let colorWrap = ["#1be5e7", "#1be5e7", "#1be5e7"];
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
    var myChartS = echarts.init(document.getElementById('home-right-bottom-bottom'));
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
        grid: {
            left: '100',
            right: '50',
            bottom: '40',
            top: '30',
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
                show: false
            },
            axisTick: {
                show: false
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
                show: false
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
                position: 'insideRight'
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
            barWidth: 15,
            data: getmyd
        }, ]
    };

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
        grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: xData
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [


            {
                name: '联盟广告',
                type: 'bar',
                stack: '广告',
                emphasis: {
                    focus: 'series'
                },
                data: line
            },
            {
                name: '视频广告',
                type: 'bar',
                stack: '广告',
                emphasis: {
                    focus: 'series'
                },
                data: line2
            },

        ]
    };


    option && myChart.setOption(option);
    optionT && myChartT.setOption(optionT);
    optionS && myChartS.setOption(optionS);

    function circulation() {
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



        document.getElementsByClassName("home-left-top-bottom-top")[0].innerHTML = first.join('');
        document.getElementsByClassName("home-left-top-bottom-bottom")[0].innerHTML = second.join('');
        document.getElementsByClassName("home-left-center-bottom-right")[0].innerHTML = device.join('');
        document.getElementsByClassName("home-center-bottom-bottom-content")[0].innerHTML = alert.join('');
        document.getElementsByClassName("home-right-top-bottom")[0].innerHTML = backward.join('');

    }
    circulation()

    //监听Tab切换，以改变地址hash值

    var layid = location.hash.replace(/^#test=/, '');
    element.tabChange('demo', layid);

    element.on('tab(demo)', function (elem) {
        location.hash = 'test1=' + this.getAttribute('lay-id');

    });






    // 标题隐藏与显示





    var scrollContent = document.getElementById("scrollContent");
    var contentUl = scrollContent.children[0];
    var direction = -1; //方向
    var timer = null; //定义定时器
    contentUl.innerHTML += contentUl.innerHTML;
    setTimeout(move, 1000); //执行一次定时器

    function move() {
        timer = setInterval(function () {
            contentUl.style.top = contentUl.offsetTop + direction + 'px';
            // console.log("获取当前元素到顶部的距离：" + contentUl.offsetTop);
            // console.log("获取当前元素的高度：" + contentUl.offsetHeight);
            // console.log(contentUl.style.top)

            //向上滚动小于当前元素高度的一半时，则执行如下操作
            if (contentUl.offsetTop <= -contentUl.offsetHeight / 2) {
                contentUl.style.top = 0;
            }
            //向下滚动大于0时，则执行如下操作
            else if (contentUl.offsetTop >= 0) {
                contentUl.style.top = -contentUl.offsetHeight / 2 + "px";
                // console.log(contentUl.style.top)
            }
        }, 30);

        scrollContent.onmouseenter = function () {
            clearInterval(timer);
        }

        scrollContent.onmouseleave = function () {
            setTimeout(move, 30);
        }
    }




});