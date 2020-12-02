const db = require('../configs/db')
const consts = require('../configs/constants')
require('dotenv').config()


var mysql = require('mysql');
var db = mysql.createConnection({
  host : 'database',
  user : 'root',
  password : 'root',
  database : 'fish_and_chips' 
})
db.connect();

// 테이블 authenticated_domains
// desc authenticated_domains

// 구글 익스텐션 Request.body 키 값을 토큰화 시킨 도메인값을 domain 변수에 저장


var domain = 

    
// 도메인명에 해당하는 테이블을 출력. 출력이 되면 논 피싱, 출력이 안되면 피싱
    
var sql = 'SELECT ' + domain + ' FROM authenticated_domains';
db.query(sql, function(err){
  if(err) {
    console.log('Fishing');
  } else {
    console.log('None Fishing');
  }
}


exports.testFunc = async (req, res) => {

	try {

		// var conn = await db.getConn()

		// Ex.
		// query = "insert into users (email, password) values (?, ?)"
		// params = ["captstone2", "1234"]
		
		// const result = await conn.sendQuery(
		// 	query, // SQL Query
		// 	params // Query Params
		// )


	} catch (e) {

	}
}
