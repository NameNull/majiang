const fs = require('fs');
const sql = require('sql.js');
const path = require('path');
var os = require("os");

let wallet_db_url = path.join(os.homedir(),"db.sqlite");
fs.access(wallet_db_url, function(err) {
    if(err){
        var db = new sql.Database();
        var sql_str = "CREATE TABLE log (id INTEGER PRIMARY KEY, user1 double, user2 double, user3 double, user4 double, rate int, create_time datetime);";
        db.run(sql_str);
        var data = db.export();
        var buffer = new Buffer(data);
        fs.writeFileSync(wallet_db_url, buffer);
        db.close();
    }
});