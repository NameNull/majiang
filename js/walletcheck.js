const fs = require('fs');
const sql = require('sql.js');
let conf = require("./util/conf");

let wallet_db_url = conf.db_file;
fs.access(wallet_db_url, function(err) {
    if(err){
        var db = new sql.Database();
        var sql_str = "CREATE TABLE log (id INTEGER PRIMARY KEY, user1 double, user2 double, user3 double, user4 double, name1 char, name2 char, name3 char, name4 char, flag1 int, flag2 int, flag3 int, flag4 int, note char, rate int, create_time datetime);";
        db.run(sql_str);
        var data = db.export();
        var buffer = new Buffer(data);
        fs.writeFile(wallet_db_url, buffer);
        db.close();
    }
});