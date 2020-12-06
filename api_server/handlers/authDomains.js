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

// POST to send uri
//
exports.checkIfAuthDomain = async (req, res) => {

	try {

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		if (!isUriSent(req)){

			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("요청 도메인이 없습니다")
			
			return
		}


		console.log("기업 도메인 요청 ", req.body.uri)

		var conn = await db.getConn()

		const url = new URL(req.body.uri)

		const userParams = [
			url.hostname
		]
		
		const result = await conn.sendQuery(
			db.query.authDomain.getWithDomain,
			userParams
		)

		console.log("기업 도메인 응답 결과 ", result.results)


		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.JSON
		)

		if (isDomainExists(result)){

			res.status(consts.STATUS_CODE.OK)
				.send(JSON.stringify({
					isAuthenticated : true
				}))

		} else {

			res.status(consts.STATUS_CODE.OK)
				.send(JSON.stringify({
					isAuthenticated : false
				}))
		}

	} catch (e) {

		console.log("error - ",e)

		res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
		.send("서버 오류")
	}
}

const isDomainExists = (result) => {
	return result.results.length > 0
}

const isUriSent = (req) => {
	return ('uri' in req.body) && req.body.uri != null
}

const isCreatedOk = (result) => {
	return result.results.affectedRows == 1
}

// POST to send uri
exports.registerAuthDomain = async (req, res) => {

	try {

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		if (!auth.isAccessTokenSent(req)){

			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("토큰 미전송")

			return
		}

		var token = req.header(consts.HEADER.AUTH)

		const tokenResult = await auth.checkToken(token)

		if (!tokenResult.status){
			res.status(consts.STATUS_CODE.UNAUTHORIZED)
				.send("토큰 에러")

			return
		}

		if (!tokenResult.isAdmin){
			res.status(consts.STATUS_CODE.UNAUTHORIZED)
				.send("접근 권한이 없습니다")

			return
		}

		var conn = await db.getConn()

		// body 검사하기
		if (!isUriSent(req)){
			
			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("생성할 데이터 부족")

			return
		}

		console.log("등록 요청 - ", req.body.uri)

		const url = new URL(req.body.uri)

		const userParams = [
			url.hostname
		]

		// TO-DO :중복 생성 체크
		
		
		const result = await conn.sendQuery(
			db.query.authDomain.create,
			userParams
		)		
		
		console.log("등록 결과 - ", result.results)

		const payload = {
			email: tokenResult.email,
			userId: tokenResult.userId,
			isAdmin: tokenResult.isAdmin
		}

		token = await auth.publishJwt(payload)

		res.setHeader(consts.HEADER.AUTH, token)

		if (isCreatedOk(result)){
			
			res.status(consts.STATUS_CODE.OK)
				.send("등록 성공")

		} else {

			res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
				.send("등록 실패")
		}

	} catch (e) {

		console.log("등록 실패 - ", e)

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
			.send("서버 오류")
	}
}

const isAuthDomainUpdateInfoSent = (req) => {
	return ('uri' in req.body) && req.body.uri != null
}

const isUpdatedOk = (result) => {
	return result.results.affectedRows == 1
}

exports.updateAuthDomain = async (req, res) => {

	try {

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)


		if (!auth.isAccessTokenSent(req)){

			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("토큰 미전송")

			return
		}

		var token = req.header(consts.HEADER.AUTH)

		const tokenResult = await auth.checkToken(token)

		if (!tokenResult.status){
			res.status(consts.STATUS_CODE.UNAUTHORIZED)
				.send("토큰 에러")

			return
		}

		if (!tokenResult.isAdmin){
			res.status(consts.STATUS_CODE.UNAUTHORIZED)
				.send("접근 권한이 없습니다")

			return
		}

		if (!isAuthDomainUpdateInfoSent(req)){
	
			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("인증 도메인 수정 데이터 부족")

			return
		}

		
		var conn = await db.getConn()

		const url = new URL(req.body.uri)

		const userParams = [
			url.hostname,			
			req.params.authDomainId 
		]
		
		const result = await conn.sendQuery(
			db.query.authDomain.update,
			userParams
		)

		const payload = {
			email: tokenResult.email,
			userId: tokenResult.userId,
			isAdmin: tokenResult.isAdmin
		}

		token = await auth.publishJwt(payload)

		res.setHeader(consts.HEADER.AUTH, token)

		// console.log("수정 결과 ", result)

		if (isUpdatedOk(result)){

			res.status(consts.STATUS_CODE.OK)
				.send("인증 도메인 데이터 수정 성공")

		} else {

			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("인증 도메인 데이터수정 실패")
		}


	} catch (e) {

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
			.send("서버 오류")
	}
}


const isDeletedSuccess = (result) => {
	return result.results.affectedRows == 1
}

// For Admin User
exports.deleteReport = async (req, res) => {

	try {

		if (!auth.isAccessTokenSent(req)){

			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("토큰 미전송")

			return
		}

		var token = req.header(consts.HEADER.AUTH)

		const tokenResult = await auth.checkToken(token)

		if (!tokenResult.status){
			res.status(consts.STATUS_CODE.UNAUTHORIZED)
				.send("토큰 에러")

			return
		}

		if (!tokenResult.isAdmin){
			res.status(consts.STATUS_CODE.UNAUTHORIZED)
				.send("접근 권한이 없습니다")

			return
		}


		var conn = await db.getConn()

		const userParams = [
			req.params.authDomainId
		]
		
		const result = await conn.sendQuery(
			db.query.authDomain.delete,
			userParams
		)

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		const payload = {
			email: tokenResult.email,
			userId: tokenResult.userId,
			isAdmin: tokenResult.isAdmin
		}

		token = await auth.publishJwt(payload)

		res.setHeader(consts.HEADER.AUTH, token)

		// IF Deleted
		if (isDeletedSuccess(result)){
	
			res.status(consts.STATUS_CODE.OK)
				.send("삭제 성공")
	
		} else {
	
			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("삭제 실패")
		}


	} catch (e) {

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
		.send("서버 오류")
	}
}
