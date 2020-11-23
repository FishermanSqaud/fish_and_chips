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
        create : `insert into users (email, password) values (?, ?)`,
        get :  `select * from users where email = ?`,
        getWithPwd : `select * from users where email = ? and password = ?`,
        delete : `delete from users where email = ?`
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

const sendQuery = (conn) => (query, params) => {
    return new Promise((res, rej) => {
        const queryInfo = {
            sql: query,
            values: params
        }

        conn.query(queryInfo, (err, results, fields) => {
            if (err) {
                err.status = this.queryError
                rej(err)
                return
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

