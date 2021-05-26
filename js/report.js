import {
    baseUrl
} from "./params.js";

$(function () {
    vm.selectCompany();
    vm.selectDeviceTypeNum();
    vm.selectInspect();
    vm.selectAlarmType();
    vm.selectAlarmListGroupDevice();
    vm.selectDeviceType();
    vm.getDwlist();
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
		token:JSON.parse(localStorage.getItem('loginInfo')).token,
        dwlist: []
    },
    methods: {

       

        selectCompany: function () {
            var date = new Date();
            vm.DailyReportData = date .toLocaleDateString();
            var data = {
                "token": vm.token,
                "companyId": vm.companyId
            };
            $.ajax({
                url:  baseUrl + "/company/info",
                type: 'get',
                dataType: "json",
                data: data,
                cache: false,
                async: false,
                success: function (data) {
                    var result = data.rows;
                    vm.CompanySite = result.companyName;
                    vm.CompanyAdress = result.companyAddress;

                },
                error: function () {
                }
            });
        },
        selectAlarmListGroupDevice: function () {
            var data = {
                "token": vm.token,
                "companyId": vm.companyId
            };
            $.ajax({
                url: baseUrl + "/alarm/listgroupdevice",
                type:"get",
                dataType:"json",
                data:data,
                async: false,
                success:function (data) {
                    var result = data.rows;
                    var eleArray = result.eleArray;
                    var woterArray = result.woterArray;
                    // var table1 = document.getElementById("table1");
                    var html1 = "";
                    if(eleArray.length>0){
                        for(var i=0;i<eleArray.length;i++){
                            html1+=  "<tr style=\"line-height: 20px;\"><td>"+eleArray[i].location+"</td><td>"+eleArray[i].alarmTime+"</td><td>"+eleArray[i].alarmMassage+"</td><td>"+eleArray[i].isSolve+"</td><td>"+eleArray[i].sum+"</td></tr>"
                        }
                    }
                    // table1.innerHTML+= html1;
                    $("#table1").append(html1);
                    // var table2 = document.getElementById("table2");
                    var html2 = "";
                    if(woterArray.length>0){
                        for(var i=0;i<woterArray.length;i++){
                            html2+=  "<tr style=\"line-height: 20px;\"><td>"+woterArray[i].location+"</td><td>"+woterArray[i].alarmTime+"</td><td>"+woterArray[i].alarmMassage+"</td><td>"+woterArray[i].isSolve+"</td><td>"+woterArray[i].sum+"</td></tr>"
                        }
                    }
                    $("#table2").append(html2);
                    // table2.innerHTML += html2;
                }
            })
        },
        selectAlarmType:function () {
            var data = {
                "token": vm.token,
                "companyId": vm.companyId
            };
            $.ajax({
                url: baseUrl + "/alarm/alarmnumbytype",
                type:"get",
                dataType:"json",
                data:data,
                async: false,
                success:function (data) {
                    var result = data.rows;
                    var eleArray = result.eleArray;
                    var woterArray = result.woterArray;
                    if(eleArray.length>0){
                        for(var i=0;i<eleArray.length;i++){
                            if(i+1 == eleArray.length){
                                vm.ElectricityDeviceAlarmReason += eleArray[i].message;
                            }else {
                                vm.ElectricityDeviceAlarmReason += eleArray[i].message+"、";
                            }
                        }
                    }
                    if(woterArray.length>0){
                        for(var i=0;i<woterArray.length;i++){
                            if(i+1 == woterArray.length){
                                vm.WaterDeviceAlarmReason += woterArray[i].message;
                            }else {
                                vm.WaterDeviceAlarmReason += woterArray[i].message+"、";
                            }

                        }
                    }
                }
            })
        },
        selectInspect: function (){
            var data = {
                "token": vm.token,
                "companyId": vm.companyId
            };
            $.ajax({
                url: baseUrl + "/inspectadd/listnumbycompany",
                type:"get",
                dataType:"json",
                data:data,
                async: false,
                success:function (data) {
                    console.log(data);
                    var result = data.rows;
                    vm.CardNumber = result.cardNumber;
                    vm.CardPatrolNumber = result.cardPatrolNumber;
                    vm.CardNOTPatrolNumber = result.cardNOTPatrolNumber;
					if(result.CardNumber>0  ||  vm.companyId==1){
						vm.HaveXuncha = 1;
						vm.CardPatrolRate = Math.round(result.cardPatrolNumber/result.cardNumber*10000)/100+"%";
					}
					else{
						vm.CardPatrolRate = 0+"%";
					}
                    
                }
            })
        },
        selectDeviceType: function (){
            var data = {
                "token": vm.token,
                "companyId": vm.companyId
            };
            $.ajax({
                url: baseUrl + "/device/devicetype",
                type:"get",
                dataType:"json",
                data:data,
                async: false,
                success:function (data) {
                    console.log(data);
                    var result = data.rows;
                    if(result.length>0){
                        for(var i=0;i<result.length;i++){

                            if(result[i].type=='01' ||  vm.companyId==1){
                                vm.HaveMeter = 1;
                            }
                            if(result[i].type=='02' ||  vm.companyId==1){
                                vm.HaveWater = 1;
                            }
                            if(result[i].type=='03' ||  vm.companyId==1){
                                vm.HaveWater = 1;
                            }
                            if(result[i].type=='05' ||  vm.companyId==1){
                                vm.HaveVideo = 1;
                            }
                            if(result[i].type=='06' ||  vm.companyId==1){
                                vm.HaveSmoke = 1;
                            }
                        }
                    }

                }
            })
        },
        selectDeviceTypeNum: function () {

            var data = {
                "token": vm.token,
                "companyId": vm.companyId
            };
            $.ajax({
                url:  baseUrl + "/devicestatistics/info",
                type: 'get',
                dataType: "json",
                data: data,
                cache: false,
                async: false,
                success: function (data) {

                    var result = data.rows;
                    //电
                    vm.ElectricityDeviceNumber = result.eleSum;
                    vm.ElectricityDeviceOnNumber = result.eleOnline;
                    vm.ElectricityDeviceOffNumber = result.eleOffline;
                    vm.ElectricityDeviceAlarmNumber = result.eleAlarm;
                    vm.ElectricityDeviceOnLineRate = ((1-result.eleOffline/result.eleSum)*100).toFixed(2)+"%";

                    //水
                    vm.WaterDeviceNumber = result.waterSum;
                    vm.WaterDeviceOnNumber = result.waterOnline;
                    vm.WaterDeviceOffNumber = result.waterOffline;
                    vm.WaterDeviceAlarmNumber = result.waterAlarm;
                    vm.WaterDeviceOnLineRate = Math.round((1-result.waterOffline/result.waterSum)*10000)/100+"%";

                    //监控
                    // vm.WaterDeviceAlarmNumber = result.videoSum;
                    // vm.WaterDeviceAlarmNumber = result.videoOnline;
                    // vm.WaterDeviceAlarmNumber = result.videoOffline;
                    // vm.WaterDeviceAlarmNumber = result.videoAlarm;



                },
                error: function () {
                }
            });
        },
        getDwlist: function(){
            var data = {
                "token": vm.token,
                "companyId": vm.companyId
            };
            $.ajax({
                url: baseUrl + "/serve/dwlist",
                type:"get",
                dataType:"json",
                data:data,
                async: false,
                success:function (res) {
                    console.log(res);
                    const { rows } = res;
                    vm.dwlist = rows;
                }
            })
        }

    }
});

