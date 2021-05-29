import {
    baseUrl
} from "./params.js";
layui.use(['element', 'layer', 'form'], function () {
    var tree = layui.tree;
    var form = layui.form;
    var laydate = layui.laydate;
    //树形列表
    var treeData = []

    //树形结构ajax
    $.ajax({
        url: baseUrl + '/company/listtree?token=' + JSON.parse(localStorage.getItem("loginInfo")).token,
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
            else if(res.code = 200){
                treeData = function () {
                    return [{
                        title: res.rows.companyName,
                        id: res.rows.id,
                        spread: true,
                        children: res.rows.companyVOS.map(item => {
                            return {
                                title: item.companyName,
                                id: item.id,
                                spread: false, //节点关闭
                                children: item.companyVOS.length !== 0 ? item.companyVOS.map(value => {
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
    var id = null;
    //树形结构
    tree.render({
        elem: '#zreeList',
        data: treeData,
        showLine: true //是否开启连接线
            ,
        click: function (obj) {
            //节点高亮
            var nodes = document.getElementsByClassName("layui-tree-txt");
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].innerHTML === obj.data.title) {
                    nodes[i].style.color = "red";
                    nodes[i].style.fontWeight = "Bold";
                } else {
                    nodes[i].style.color = "#a3c1b0";
                    nodes[i].style.fontWeight = "normal";
                }

            }
            id = obj.data.id;
            vm.companyId = obj.data.id;
            vm.unify(id);
        }
    })
    laydate.render({
        elem: '#date',
        type: 'month',
        value: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        max: -32,
        done: function(value, date){
            vm.DailyReportData = date.year + '/' + Number(date.month + 1) + '/1'
          }
    });
    form.on('submit(submitDoubleBtn)', function (data) {

        vm.unify(data.field.companyId);
        return false;
    });

    form.on('submit(submitBtn)', function (data) {
        vm.selectCompany(vm.companyId);
        vm.selectDeviceTypeNum(vm.companyId);
        vm.selectInspect(vm.companyId);
        vm.selectAlarmType(vm.companyId);
        vm.selectDeviceType(vm.companyId);
        vm.selectAlarmListGroupDevice(vm.companyId,data.field.alarmDate);
        vm.getDwlist(vm.companyId,data.field.alarmDate);
        return false;
    });
})

$(function () {
    var date = new Date();
    date.setDate(1)
    vm.DailyReportData = date.toLocaleDateString();
    // vm.selectCompany();
    // vm.selectDeviceTypeNum();
    // vm.selectInspect();
    // vm.selectAlarmType();
    // vm.selectAlarmListGroupDevice();
    // vm.selectDeviceType();
    // vm.getDwlist();
    vm.unify(vm.companyId);
});


var vm = new Vue({
    el: '#frame',
    data: {
        companyId: JSON.parse(localStorage.getItem('loginInfo')).companyId,
        CompanySite: "",
        RepostType1: "",
        DailyReportData: "",
        CompanyAdress: "",
        CardNumber: 0,
        CardPatrolNumber: 0,
        CardNOTPatrolNumber: 0,
        CardPatrolRate: 0,
        ElectricityDeviceNumber: 0,
        ElectricityDeviceOnNumber: 0,
        ElectricityDeviceOffNumber: 0,
        ElectricityDeviceAlarmNumber: 0,
        ElectricityDeviceOnLineRate: 0,
        ElectricityDeviceAlarmReason: "",
        WaterDeviceNumber: 0,
        WaterDeviceOnNumber: 0,
        WaterDeviceOffNumber: 0,
        WaterDeviceAlarmNumber: 0,
        WaterDeviceOnLineRate: 0,
        WaterDeviceAlarmReason: "",
        videoNumber: 0,
        videoAlarmNumber: 0,
        HaveMeter: 0,
        HaveWater: 0,
        HaveVideo: 0,
        HaveXuncha: 0,
        HaveSmoke: 0,
        token: JSON.parse(localStorage.getItem('loginInfo')).token,
        dwlist: []
    },
    methods: {
        buttom: function() {
            $("#pagecontent").wordExport(vm.CompanySite + "运行报告");
        },
        selectCompany: function (id) {
            var data = {
                "token": vm.token,
                "companyId": id
            };
            $.ajax({
                url: baseUrl + "/company/info",
                type: 'get',
                dataType: "json",
                data: data,
                cache: false,
                async: false,
                success: function (data) {
                    if(data.code === 20001){
                        layer.alert('登录已过期请重新登陆', {
                            skin: 'layui-layer-yingke' //样式类名
                            ,closeBtn: 0
                            }, function(){
                                parent.location.href = './index.html'
                            });
                    } 
                   else if(data.code === 200){
                    var result = data.rows;
                    vm.CompanySite = result.companyName;
                    vm.CompanyAdress = result.companyAddress;
                   }else {
                    layer.msg(data.msg, {
                        icon: 2,
                        closeBtn: 0,
                        anim: 6, //动画类型
                        time: 3000
                    });
                }

                },
                error: function () {}
            });
        },
        selectAlarmListGroupDevice: function (id,time) {
            var data = {
                "token": vm.token,
                "companyId": id,
                'alarmDate': time
            };
            $.ajax({
                url: baseUrl + "/alarm/listgroupdevice",
                type: "get",
                dataType: "json",
                data: data,
                async: false,
                success: function (data) {
                    if(data.code === 20001){
                        layer.alert('登录已过期请重新登陆', {
                            skin: 'layui-layer-yingke' //样式类名
                            ,closeBtn: 0
                            }, function(){
                                parent.location.href = './index.html'
                            });
                    } 
                    else if(data.code === 200){
                        var result = data.rows;
                    var eleArray = result.eleArray;
                    var woterArray = result.woterArray;
                    // var table1 = document.getElementById("table1");
                    var html1 = "";
                    if (eleArray.length > 0) {
                        for (var i = 0; i < eleArray.length; i++) {
                            html1 += "<tr style=\"line-height: 20px;\"><td>" + eleArray[i].location + "</td><td>" + eleArray[i].alarmTime + "</td><td>" + eleArray[i].alarmMassage + "</td><td>" + eleArray[i].isSolve + "</td><td>" + eleArray[i].sum + "</td></tr>"
                        }
                    }
                    // table1.innerHTML+= html1;
                    $("#table1").html(html1);
                    // var table2 = document.getElementById("table2");
                    var html2 = "";
                    if (woterArray.length > 0) {
                        for (var i = 0; i < woterArray.length; i++) {
                            html2 += "<tr style=\"line-height: 20px;\"><td>" + woterArray[i].location + "</td><td>" + woterArray[i].alarmTime + "</td><td>" + woterArray[i].alarmMassage + "</td><td>" + woterArray[i].isSolve + "</td><td>" + woterArray[i].sum + "</td></tr>"
                        }
                    }
                    $("#table2").html(html2);
                    // table2.innerHTML += html2;
                    }else {
                        layer.msg(data.msg, {
                            icon: 2,
                            closeBtn: 0,
                            anim: 6, //动画类型
                            time: 3000
                        });
                    }
                }
            })
        },
        selectAlarmType: function (id) {
            var data = {
                "token": vm.token,
                "companyId": id
            };
            $.ajax({
                url: baseUrl + "/alarm/alarmnumbytype",
                type: "get",
                dataType: "json",
                data: data,
                async: false,
                success: function (data) {
                    if(data.code === 20001){
                        layer.alert('登录已过期请重新登陆', {
                            skin: 'layui-layer-yingke' //样式类名
                            ,closeBtn: 0
                            }, function(){
                                parent.location.href = './index.html'
                            });
                    } 
                    else if(data.code === 200){
                        var result = data.rows;
                    var eleArray = result.eleArray;
                    var woterArray = result.woterArray;
                    if (eleArray.length > 0) {
                        for (var i = 0; i < eleArray.length; i++) {
                            if (i + 1 == eleArray.length) {
                                vm.ElectricityDeviceAlarmReason += eleArray[i].message;
                            } else {
                                vm.ElectricityDeviceAlarmReason += eleArray[i].message + "、";
                            }
                        }
                    }
                    if (woterArray.length > 0) {
                        for (var i = 0; i < woterArray.length; i++) {
                            if (i + 1 == woterArray.length) {
                                vm.WaterDeviceAlarmReason += woterArray[i].message;
                            } else {
                                vm.WaterDeviceAlarmReason += woterArray[i].message + "、";
                            }

                        }
                    }
                    }else {
                        layer.msg(data.msg, {
                            icon: 2,
                            closeBtn: 0,
                            anim: 6, //动画类型
                            time: 3000
                        });
                    }
                }
            })
        },
        selectInspect: function (id) {
            var data = {
                "token": vm.token,
                "companyId": id
            };
            $.ajax({
                url: baseUrl + "/inspectadd/listnumbycompany",
                type: "get",
                dataType: "json",
                data: data,
                async: false,
                success: function (data) {
                    if(data.code === 20001){
                        layer.alert('登录已过期请重新登陆', {
                            skin: 'layui-layer-yingke' //样式类名
                            ,closeBtn: 0
                            }, function(){
                                parent.location.href = './index.html'
                            });
                    } 
                   else if(data.code === 200){
                    var result = data.rows;
                    vm.CardNumber = result.cardNumber;
                    vm.CardPatrolNumber = result.cardPatrolNumber;
                    vm.CardNOTPatrolNumber = result.cardNOTPatrolNumber;
                    if (result.CardNumber > 0) {
                        vm.HaveXuncha = 1;
                        vm.CardPatrolRate = Math.round(result.cardPatrolNumber / result.cardNumber * 10000) / 100 + "%";
                    } else {
                        vm.CardPatrolRate = '';
                    }
                   }else {
                    layer.msg(data.msg, {
                        icon: 2,
                        closeBtn: 0,
                        anim: 6, //动画类型
                        time: 3000
                    });
                }

                }
            })
        },
        selectDeviceType: function (id) {
            vm.HaveMeter = 0;
            vm.HaveWater = 0;
            vm.HaveWater = 0;
            vm.HaveVideo = 0;
            vm.HaveSmoke = 0;
            var data = {
                "token": vm.token,
                "companyId": id
            };
            $.ajax({
                url: baseUrl + "/device/devicetype",
                type: "get",
                dataType: "json",
                data: data,
                async: false,
                success: function (data) {
                    if(data.code === 20001){
                        layer.alert('登录已过期请重新登陆', {
                            skin: 'layui-layer-yingke' //样式类名
                            ,closeBtn: 0
                            }, function(){
                                parent.location.href = './index.html'
                            });
                    } 
                   else if(data.code === 200){
                    var result = data.rows;
                    if (result.length > 0) {
                        for (var i = 0; i < result.length; i++) {

                            if (result[i].type == '01') {
                                vm.HaveMeter = 1;
                            }
                            if (result[i].type == '02') {
                                vm.HaveWater = 1;
                            }
                            if (result[i].type == '03') {
                                vm.HaveWater = 1;
                            }
                            if (result[i].type == '05') {
                                vm.HaveVideo = 1;
                            }
                            if (result[i].type == '06') {
                                vm.HaveSmoke = 1;
                            }
                        }
                    }
                   }else {
                    layer.msg(data.msg, {
                        icon: 2,
                        closeBtn: 0,
                        anim: 6, //动画类型
                        time: 3000
                    });
                }

                }
            })
        },
        selectDeviceTypeNum: function (id) {

            var data = {
                "token": vm.token,
                "companyId": id
            };
            $.ajax({
                url: baseUrl + "/devicestatistics/info",
                type: 'get',
                dataType: "json",
                data: data,
                cache: false,
                async: false,
                success: function (data) {
                    if(data.code === 20001){
                        layer.alert('登录已过期请重新登陆', {
                            skin: 'layui-layer-yingke' //样式类名
                            ,closeBtn: 0
                            }, function(){
                                parent.location.href = './index.html'
                            });
                    } 
                    else if(data.code === 200){
                        var result = data.rows;
                        //电
                        vm.ElectricityDeviceNumber = result.eleSum;
                        vm.ElectricityDeviceOnNumber = result.eleOnline;
                        vm.ElectricityDeviceOffNumber = result.eleOffline;
                        vm.ElectricityDeviceAlarmNumber = result.eleAlarm;
                        vm.ElectricityDeviceOnLineRate = result.eleSum > 0 ? ((1 - result.eleOffline / result.eleSum) * 100).toFixed(2) + "%" : '';

                        //水
                        vm.WaterDeviceNumber = result.waterSum;
                        vm.WaterDeviceOnNumber = result.waterOnline;
                        vm.WaterDeviceOffNumber = result.waterOffline;
                        vm.WaterDeviceAlarmNumber = result.waterAlarm;
                        vm.WaterDeviceOnLineRate = result.waterSum > 0 ? Math.round((1 - result.waterOffline / result.waterSum) * 10000) / 100 + "%" : '';

                        //监控
                        vm.videoAlarmNumber = result.videoAlarm;
                        vm.videoNumber = result.videoSum;
                    }else {
                        layer.msg(data.msg, {
                            icon: 2,
                            closeBtn: 0,
                            anim: 6, //动画类型
                            time: 3000
                        });
                    }
                },
                error: function () {}
            });
        },
        getDwlist: function (id,time) {
            var data = {
                "token": vm.token,
                "companyId": id,
                "serviceTime": time
            };
            $.ajax({
                url: baseUrl + "/serve/dwlist",
                type: "get",
                dataType: "json",
                data: data,
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
                        const {
                            rows
                        } = res;
                        vm.dwlist = rows;
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
        },
        getZtreeList: function () {
            var selectDate = [{
                title: "请选择单位",
                value: ""
            }]
            var selectList = []
            $.ajax({
                url: baseUrl + "/company/ztreelist?token=" + JSON.parse(localStorage.getItem('loginInfo')).token,
                async: false,
                traditional: true,
                dataType: "json",
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
        },
        unify: function (id) {
            this.$options.methods.selectCompany(id);
            this.$options.methods.selectAlarmListGroupDevice(id);
            this.$options.methods.selectAlarmType(id);
            this.$options.methods.selectInspect(id);
            this.$options.methods.selectDeviceType(id);
            this.$options.methods.selectDeviceTypeNum(id);
            this.$options.methods.getDwlist(id);
            this.$options.methods.getZtreeList();
        }

    }
});