var $ = require("jquery");
import  "./js/util/sgutil";
let os = require("os");
let fs = require("fs");
var post_id = 1;

let db_file = 'http://43.230.141.43:8011/db.sqlite';
db_file = os.homedir()+'/db.sqlite';

function db_connect(callback){
    let worker = new Worker(process.cwd() + "/js/util/worker.sql.js");
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
            return;
            location.reload(true);
        };
        let create_time = new Date().getTime();
        let sqlstr = "insert into log (user1, user2, user3, user4, rate, create_time) values (:user1, :user2, :user3, :user4, :rate, :create_time);";
        let params = {
            ":user1": param.user1,
            ":user2": param.user2,
            ":user3": param.user3,
            ":user4": param.user4,
            ":rate": param.rate,
            ":create_time": create_time
        };
        worker.postMessage({
            id: post_id++,
            action: 'run',
            params: params,
            sql: sqlstr
        });
    });
}


var user1 = $("#user1");
var user2 = $("#user2");
var user3 = $("#user3");
var user4 = $("#user4");
var tab1 = $("#tab1");
var tab1 = $("#tab2");

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
                var rate = tables[0]['values'][j][5];
                var time = new Date(tables[0]['values'][j][6]).format('MM-dd HH:mm');
                html+="<tr data-id='"+id+"'>"+
                    "<td class='gray'>"+time+"</td>"+
                    "<td class='gray'>"+rate+"</td>";
                for(var i=0;i<4;i++){
                    if(arr[i]<0){
                        html+="<td class='red'>"+(arr[i])+"</td>";
                    }else{
                        html+="<td>"+(arr[i])+"</td>";
                    }
                }
                html+="<td>"+(arr[0]+arr[2]+arr[3]+arr[1])+"</td>";
                var max = arr.max();
                var res = 0;
                var controller = true;
                for(var i=0;i<4;i++){
                    if(controller && max == arr[i]){
                        controller = false;
                        res +=((max-20)*rate);
                        if(max-20<0){
                            html+="<td class='red'>"+((max-20)*rate)+"</td>";
                        }else{
                            html+="<td>"+((max-20)*rate)+"</td>";
                        }
                    }else{
                        res+=(arr[i]*rate);
                        if(arr[i]<0){
                            html+="<td class='red'>"+(arr[i]*rate)+"</td>";
                        }else{
                            html+="<td>"+(arr[i]*rate)+"</td>";
                        }
                    }
                }
                controller = true;
                html+="<td>"+res+"</td>"+
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
    if(val1==""){
        alert("user1空！");
        return;
    }
    if(val2==""){
        alert("user2空！");
        return;
    }
    if(val3==""){
        alert("user3空！");
        return;
    }
    if(val4==""){
        alert("user4空！");
        return;
    }
    try{
        let params = {
            user1: val1,
            user2: val2,
            user3: val3,
            user4: val4,
            rate: rate
        };
        db_add(params);
    }catch(e){
        alert(JSON.stringify(e));
    }
});
$("#user1").focus();
$("#tab").on("click",".delete",function(){
    if(confirm("确认删除吗？")){
        var id = $(this).closest("tr").data("id");
        console.log(id);
        try{
            logDao.delete(id);
            location.reload(true);
        }catch (e){
            alert(JSON.stringify(e));
        }
    }
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