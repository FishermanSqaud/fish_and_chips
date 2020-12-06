var mysql = require('mysql');
require('dotenv').config()

exports.pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

exports.query = {
    user : {
        create : `insert into users (email, password, name) values (?, ?, ?)`,
        get :  `select * from users where email = ?`,
        getAll : 'select * from users',
        getWithPwd : `select * from users where email = ? and password = ?`,
        delete : `delete from users where email = ?`
    },
    report : {
        getWithDomain : 'select * from reports where spam_domain = ?',
        get : "select * from reports where user_id = ?",
        getAll : "select * from reports",
        create : 'insert into reports (spam_domain, user_id, title, content) values (?, ?, ?, ?)',
        update : 'update reports SET title=?, content=? where id=?',
        delete : 'delete from reports where id = ?'
    },
    authDomain : {
        getWithDomain : 'select * from authenticated_domains where domain = ?',
        create : 'insert into authenticated_domains (domain) values (?)',
        update : 'update authenticated_domains SET domain=? where id=?',
        delete : 'delete from authenticated_domains where id = ?'
    },
    userWithReports : {
        get : 'select * from users join reports on users.id = reports.user_id'
    }
}

exports.getConn = () => new Promise((res, rej)=>{
    exports.pool.getConnection((err, conn)=>{
        if (err){
            rej(err)
            return
        }

        conn.sendQuery = sendQuery(conn)
		conn.testFunc = (a) => console.log(a)

        res(conn)
    })
})

const sendQuery = (conn) => (query, params, connRelease = true) => {
    return new Promise((res, rej) => {
        const queryInfo = {
            sql: query,
            values: params
        }

        conn.query(queryInfo, (err, results, fields) => {
            if (err) {
                err.status = this.queryError
                conn.release()
                rej(err)
                return
            }

            if (connRelease){
                conn.release()
            }
            
            res({
                results: results,
                fields: fields
            })
        })
    })
}


// const sendQuery = (conn, query, params) => {
//     return new Promise((res, rej) => {
//         const queryInfo = {
//             sql: query,
//             values: params
//         }

//         conn.query(queryInfo, (err, results, fields) => {
//             if (err) {
//                 err.status = this.queryError
//                 rej(err)
//                 return
//             }

//             res({
//                 results: results,
//                 fields: fields
//             })
//         })
//     })
// }

