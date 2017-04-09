var {connection} = require("./connection");

let logDao = {
    find: (day) => {
        let today_begin;
        let today_end;
        today_begin = new Date(day).getTime();
        today_end = today_begin + 24*60*60*1000;
        let fn = (db) => {
            let res = db.exec("select * from log where create_time between "+today_begin+" and "+today_end+" order by create_time desc;");
            return res;
        };
        return connection.operate(fn);
    },
    add: (param) => {
        let fn = (db) => {
            let time = new Date().getTime();
            let result = db.run("insert into log (user1, user2, user3, user4, name1, name2, name3, name4, flag1, flag2, flag3, flag4, note, rate, create_time) values (:user1, :user2, :user3, :user4, :name1, :name2, :name3, :name4, :flag1, :flag2, :flag3, :flag4, :note, :rate, :create_time);",
                {
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
                    ":create_time": time
                });
            connection.write(db);
            return result;
        };
        return connection.operate(fn);
    },
    update: (id, flag, status) => {
        let fn = (db) => {
            let res = db.run("update log set flag"+flag+" = :status where id = :id",{
                ":status": status,
                ":id": id
            });
            connection.write(db);
            return res;
        };
        return connection.operate(fn);
    },
    update_note: (id, note) => {
        let fn = (db) => {
            let res = db.run("update log set note = :note where id = :id",{
                ":note": note,
                ":id": id
            });
            connection.write(db);
            return res;
        };
        return connection.operate(fn);
    },
    delete: (id) => {
        let fn = (db) => {
            let res = db.run("delete from log where id = :id;",{
                ":id": id
            });
            connection.write(db);
            return res;
        };
        return connection.operate(fn);
    }
};
module.exports = {logDao: logDao};