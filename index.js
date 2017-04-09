var $ = require("jquery");
import  "./js/util/sgutil";
let fs = require("fs");
let path = require("path");
let conf = require("./js/util/conf");

let db_file = conf.db_file;
var post_id = 1;

function db_connect(callback){
    let worker = new Worker("https://s1.zhgtrade.com/common/js/worker.sql.js");
    worker.onerror = function(e) {console.log("Worker error: ", e)};
    let xhr = new XMLHttpRequest();
    xhr.open('GET', db_file, true);
    xhr.responseType = 'arraybuffer';
    xhr.send();
    xhr.onload = function(e) {
        console.log("open");
        worker.postMessage({
            id:post_id++,
            action:'open',
            buffer:this.response, /*Optional. An ArrayBuffer representing an SQLite Database file*/
        });
        let result = () => {
            console.log("close");
            worker.postMessage({
                id:post_id++,
                action:'close'
            });
        };
        worker.onmessage = function() {
            callback && callback(worker,result);
        };
    };
}

function db_find(day,callback){
    db_connect(function(worker,res){
        console.log("find");
        let today_begin;
        let today_end;
        today_begin = new Date(day).getTime();
        today_end = today_begin + 24*60*60*1000;
        worker.onmessage = function(event){
            console.log("success");
            callback && callback(event.data.results);
            res && res();
        };
        worker.postMessage({
            id:post_id++,
            action: 'exec',
            sql: "select * from log where create_time between "+today_begin+" and "+today_end+" order by create_time desc;"
        });
    });
}

function db_add(param){
    db_connect(function(worker,res) {
        console.log("add");
        worker.onmessage = function (event) {
            let buffer = event.data.results;
            fs.writeFile(db_file, buffer,(err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            res && res();
            location.reload(true);
        };
        let create_time = new Date().getTime();
        let sql_str = "insert into log (user1, user2, user3, user4, name1, name2, name3, name4, flag1, flag2, flag3, flag4, note, rate, create_time) values (:user1, :user2, :user3, :user4, :name1, :name2, :name3, :name4, :flag1, :flag2, :flag3, :flag4, :note, :rate, :create_time);";
        let params = {
            ":user1": param.user1,
            ":user2": param.user2,
            ":user3": param.user3,
            ":user4": param.user4,
            ":name1": param.name1,
            ":name2": param.name2,
            ":name3": param.name3,
            ":name4": param.name4,
            ":flag1": 0,
            ":flag2": 0,
            ":flag3": 0,
            ":flag4": 0,
            ":note": "",
            ":rate": param.rate,
            ":create_time": create_time
        };
        worker.postMessage({
            id: post_id++,
            action: 'run',
            params: params,
            sql: sql_str
        });
    });
}

function db_update(id, flag, status){
    db_connect(function(worker,res) {
        console.log("update");
        worker.onmessage = function (event) {
            let buffer = event.data.results;
            fs.writeFile(db_file, buffer,(err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            res && res();
            location.reload(true);
        };
        let sql_str = "update log set flag"+flag+" = :status where id = :id";
        let params = {
            ":status": status,
            ":id": id
        };
        worker.postMessage({
            id: post_id++,
            action: 'run',
            params: params,
            sql: sql_str
        });
    });
}

function db_update_note(id, note){
    db_connect(function(worker,res) {
        console.log("update");
        worker.onmessage = function (event) {
            let buffer = event.data.results;
            fs.writeFile(db_file, buffer,(err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            res && res();
            location.reload(true);
        };
        let sql_str = "update log set note = :note where id = :id";
        let params = {
            ":note": note,
            ":id": id
        };
        worker.postMessage({
            id: post_id++,
            action: 'run',
            params: params,
            sql: sql_str
        });
    });
}

function db_delete(id){
    db_connect(function(worker,res) {
        console.log("delete");
        worker.onmessage = function (event) {
            let buffer = event.data.results;
            fs.writeFile(db_file, buffer,(err) => {
                if (err) throw err;
                console.log("delete success");
            });
            res && res();
            location.reload(true);
        };
        let sql_str = "delete from log where id = :id;" ;
        let params = {":id": id};
        worker.postMessage({
            id: post_id++,
            action: 'run',
            params: params,
            sql: sql_str
        });
    });
}


var user1 = $("#user1");
var user2 = $("#user2");
var user3 = $("#user3");
var user4 = $("#user4");
var name1 = $("#name1");
var name2 = $("#name2");
var name3 = $("#name3");
var name4 = $("#name4");

var day = new Date().format("yyyy-MM-dd") + " 00:00:00";
function find(day){
    let result = (res) => {
        var tables = res;
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
    };
    db_find(day,result);
}
find(day);

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
        db_add(params);
    }catch(e){
        alert(JSON.stringify(e));
    }
});
$("#name1").focus();
$("#tab").on("click",".delete",function(){
    if(confirm("确认删除吗？")){
        var id = $(this).closest("tr").data("id");
        try{
            db_delete(id);
        }catch (e){
            alert(JSON.stringify(e));
        }
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
    db_update(id, flag, status);
});
$("#tab").on("blur",".note",function(){
    var val = $(this).data("val");
    var note = $(this).text();
    var id = $(this).closest("tr").data("id");
    if(note == val){
        return;
    }
    db_update_note(id, note);
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