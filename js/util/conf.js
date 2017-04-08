let os = require("os");
let path = require("path");

let db_file = 'http://43.230.141.43:8011/db.sqlite';
db_file = path.join(os.homedir(),"db1.sqlite");
module.exports = {
    db_file: db_file
};