const db = require('../configs/db')
const https = require('https')
const consts = require('../configs/constants')
require('dotenv').config()

// 목적 : 사용자가 접속한 사이트의 도메인과 DB에 저장된 기업 도메인과 비교
//
// 로직 : 1. 사용자한테 검사할 사이트 도메인을 바디로 받는다.
//       2. mysql에 접근한다. (fish_and_chips.authenticated_domains : 자체 기업 도메인 DB)
//       3. 도메인명에 해당하는 테이블을 출력.
//        3-1. 출력이 되면 논 피싱. authenticated_domains에 검사할 사이트 도메인 레코드가 존재. 그러므로 논피싱
//        3-2. 출력이 안되면 피싱. authenticated_domains에 검사할 사이트 도메인 레코드가 존재하지 않음. 고로 피싱)


var mysql = require('mysql');
var db = mysql.createConnection({
  host : 'database',
  user : 'root',
  password : 'root',
  database : 'fish_and_chips' 
})
db.connect();

// 데이터베이스 fish_and_chips
// 테이블 authenticated_domains
// desc authenticated_domains


// 웹 익스텐션 Request.body 키 값을 토큰화 시킨 도메인값을 domain 변수에 저장
// 

exports.testFunc = async (req, res) => {

	try {
		if (!('uri' in req.body) || req.body.uri == null){

			res.setHeader(
				consts.HEADER.CONTENT_TYPE,
				consts.HEADER.TEXT
			)

			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("")

			return
		}


		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.JSON
		)

		var domain = req.body.uri

		
		
		// 도메인명에 해당하는 테이블을 출력. 출력이 되면 논 피싱, 출력이 안되면 피싱
		
		var sql = 'SELECT ' + domain + ' FROM authenticated_domains';
		db.query(sql, function(err,data){
			if(err) {
  				console.log('Fishing');
 			} else {
 				console.log('None Fishing');
		  	}
		}
		

	} catch (e) {
		console.log("Error where ? ", e)

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
			.send("")
	}
}

	
		// var conn = await db.getConn()

		// Ex.
		// query = "insert into users (email, password) values (?, ?)"
		// params = ["captstone2", "1234"]
		
		// const result = await conn.sendQuery(
		// 	query, // SQL Query
		// 	params // Query Params
		// )
	
