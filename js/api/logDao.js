import connection from "./connection";

let logDao = {
    find: (day,data) => {
        let today_begin;
        let today_end;
        today_begin = new Date(day).getTime();
        today_end = today_begin + 24*60*60*1000;
        let fn = (db) => {
            let res = db.exec("select * from log where create_time between "+today_begin+" and "+today_end+" order by create_time desc ");
            return res;
        };
        let result = (res) => {
            data && data(res);
        };
        connection.operate(fn,result);
    },
    add: (user1, user2, user3, user4, rate) => {
        let fn = (db) => {
            let time = new Date().getTime();
            let result = db.run("insert into log (user1, user2, user3, user4, rate, create_time) values (:user1, :user2, :user3, :user4, :rate, :create_time)",
                {
                    ':user1':user1,
                    ':user2':user2,
                    ':user3':user3,
                    ':user4':user4,
                    ':rate':rate,
                    ':create_time':time
                });
            connection.write(db);
            return result;
        };
        connection.operate(fn);
    },
    delete: (id) => {
        let fn = (db) => {
            let res = db.run("delete from log where id='"+id+"'");
            connection.write(db);
            return res;
        };
        connection.operate(fn);
    }
};
export default logDao;