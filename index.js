var $ = require("jquery");
import  "./js/util/sgutil";
let fs = require("fs");
let path = require("path");
let {logDao} = require("./js/api/logDao");

var user1 = $("#user1");
var user2 = $("#user2");
var user3 = $("#user3");
var user4 = $("#user4");
var name1 = $("#name1");
var name2 = $("#name2");
var name3 = $("#name3");
var name4 = $("#name4");

var day = new Date().format("yyyy-MM-dd") + " 00:00:00";
find(day);
function find(day){
    var tables = logDao.find(day);
    if(tables[0] != undefined){
        var length = tables[0]['values'].length;
        $("#total").text(length);
        for(var j = 0 ;j<length;j++){
            var id = tables[0]['values'][j][0];
            var html="";
            var arr = [tables[0]['values'][j][1]*1,tables[0]['values'][j][2]*1,tables[0]['values'][j][3]*1,1*tables[0]['values'][j][4]];
            var brr = [tables[0]['values'][j][5],tables[0]['values'][j][6],tables[0]['values'][j][7],tables[0]['values'][j][8]];
            var crr = [tables[0]['values'][j][9],tables[0]['values'][j][10],tables[0]['values'][j][11],tables[0]['values'][j][12]];
            var note = tables[0]['values'][j][13];
            var rate = tables[0]['values'][j][14];
            var time = new Date(tables[0]['values'][j][15]).format('MM-dd HH:mm');
            html+="<tr data-id='"+id+"'>"+
                "<td class='gray'>"+time+"</td>"+
                "<td class='gray'>"+rate+"</td>";
            for(var i=0;i<4;i++){
                if(arr[i]<0){
                    html+="<td class='red'><p>"+(arr[i])+"</p><p>"+brr[i]+"</p></td>";
                }else{
                    html+="<td><p>"+(arr[i])+"</p><p>"+brr[i]+"</p></td>";
                }
            }
            html+="<td>"+(arr[0]+arr[2]+arr[3]+arr[1])+"</td>";
            var max = arr.max();
            var res = 0;
            var num = arr.find(max);
            for(var i=0;i<4;i++){
                var flag = crr[i] == 0 ? "dn" : "";
                if(max == arr[i]){
                    var result = (max-Math.ceil(20/num))*rate;
                    res +=result;
                    if(max-Math.ceil(20/num)<0){
                        html+="<td class='red cp flag' data-flag='"+i+"' data-status='"+crr[i]+"'><p>"+result+"</p><p>"+brr[i]+"</p><div class='mask  "+flag+"'>√</div></td>";
                    }else{
                        html+="<td class='cp flag' data-flag='"+i+"' data-status='"+crr[i]+"'><p>"+result+"</p><p>"+brr[i]+"</p><div class='mask "+flag+"'>√</div></td>";
                    }
                }else{
                    res+=(arr[i]*rate);
                    if(arr[i]<0){
                        html+="<td class='red cp flag' data-flag='"+i+"' data-status='"+crr[i]+"'><p>"+(arr[i]*rate)+"</p><p>"+brr[i]+"</p><div class='mask "+flag+"'>√</div></td>";
                    }else{
                        html+="<td class='cp flag' data-flag='"+i+"' data-status='"+crr[i]+"'><p>"+(arr[i]*rate)+"</p><p>"+brr[i]+"</p><div class='mask "+flag+"'>√</div></td>";
                    }
                }
            }
            html+="<td>"+res+"</td>"+
                "<td class='note blue' data-val='"+note+"' contenteditable='true'>"+note+"</td>"+
                "<td><a href='javascript:;' class='delete red'>删除</a></td>"+
                "</tr>";
            $("#tab").append(html);
        }
    }
}

$("#confirm").click(function(){
    var rate = $("#rate").val()*1;
    var val1 = user1.val()*1;
    var val2 = user2.val()*1;
    var val3 = user3.val()*1;
    var val4 = user4.val()*1;
    var val5 = name1.val();
    var val6 = name2.val();
    var val7 = name3.val();
    var val8 = name4.val();
    if(val1==""){
        alert("分数1空！");
        return;
    }
    if(val2==""){
        alert("分数22空！");
        return;
    }
    if(val3==""){
        alert("分数3空！");
        return;
    }
    if(val4==""){
        alert("分数4空！");
        return;
    }
    if(val5==""){
        alert("玩家1空！");
        return;
    }
    if(val6==""){
        alert("玩家2空！");
        return;
    }
    if(val7==""){
        alert("玩家3空！");
        return;
    }
    if(val8==""){
        alert("玩家4空！");
        return;
    }
    try{
        let params = {
            user1: val1,
            user2: val2,
            user3: val3,
            user4: val4,
            name1: val5,
            name2: val6,
            name3: val7,
            name4: val8,
            rate: rate
        };
        logDao.add(params);
        location.reload(true);
    }catch(e){
        alert(JSON.stringify(e));
    }
});
$("#name1").focus();
$("#tab").on("click",".delete",function(){
    if(confirm("确认删除吗？")){
        var id = $(this).closest("tr").data("id");
        logDao.delete(id);
        location.reload(true);
    }
});
$("#tab").on("click",".flag",function(){
    var status = $(this).data("status");
    if(!status){
        status = 1;
    }else{
        status = 0;
    }
    var id = $(this).closest("tr").data("id");
    var flag = $(this).data("flag") * 1 + 1;
    logDao.update(id, flag, status);
    location.reload(true);
});
$("#tab").on("blur",".note",function(){
    var val = $(this).data("val");
    var note = $(this).text();
    var id = $(this).closest("tr").data("id");
    if(note == val){
        return;
    }
    logDao.update_note(id, note);
    location.reload(true);
});
$("#date").keyup(function(e){
    if(e.keyCode == 13){
        var val = $(this).val();
        if(!/^2017-[0|1]{1}\d{1}-[0|1|2|3]{1}\d{1}$/.test(val)){
            alert("日期格式不正确！");
            return;
        }
        try{
            var html = "<tr>"+
                "<th>时间</th>"+
                "<th>倍率</th>"+
                "<th>玩家1</th>"+
                "<th>玩家2</th>"+
                "<th>玩家3</th>"+
                "<th>玩家4</th>"+
                "<th>总计</th>"+
                "<th>玩家1</th>"+
                "<th>玩家2</th>"+
                "<th>玩家3</th>"+
                "<th>玩家4</th>"+
                "<th>总计</th>"+
                "<th>操作</th>"+
                "</tr>";
            $("#tab").html(html);
            find(val + " 00:00:00");
        }catch(e){
            alert(JSON.stringify(e));
        }
    }
});