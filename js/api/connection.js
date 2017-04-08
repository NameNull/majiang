import sql from "sql";
import fs from "fs";
var path = require("path");
var os = require("os");

function con(callback){

}


let file = 'http://43.230.141.43:8011/db.sqlite';
let connection = {
    operate : (callback, result) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file, true);
        xhr.responseType = 'arraybuffer';
        xhr.send();
        xhr.onload = function(e) {
            var uInt8Array = new Uint8Array(this.response);
            var db = new SQL.Database(uInt8Array);
            let res;
            res = callback ? callback(db) : {code: 404};
            result && result(res);
            db.close();
            return res;
        };
    },
    write : (db) => {
        var data = db.export();
        var buffer = new Buffer(data);
        fs.writeFileSync(file, buffer);
    }
};

export default connection;

