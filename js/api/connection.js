var sql = require("sql");
var fs = require("fs");
var conf = require('../util/conf');

let file = conf.db_file;

let connection = {
    operate: (callback) => {
        let filebuffer = fs.readFileSync(file);
        var db = new sql.Database(filebuffer);
        let res;
        if (callback) {
            res = callback(db);
        }
        db.close();
        return res;
    },
    write: (db) => {
        var data = db.export();
        var buffer = new Buffer(data);
        fs.writeFileSync(file, buffer);
    }
};

module.exports = {
    connection: connection
}

