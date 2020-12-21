const db = require('../configs/db')
const consts = require('../configs/constants')
const auth = require('../configs/auth')

require('dotenv').config()

const isDomainSent = (req) => {
	return ('spam_domain' in req.body) && req.body.spam_domain != null
}

// POST to send uri
exports.getReportsOfDomain = async (req, res) => {

	try {

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		if (!isDomainSent(req)){

			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("요청 도메인이 없습니다")

			return
		}

		console.log("신고 내역 요청 들어옴 ", req.body.spam_domain)

		var conn = await db.getConn()

		const url = new URL(req.body.spam_domain)

		const userParams = [
			url.hostname
		]
		
		const result = await conn.sendQuery(
			db.query.report.getWithDomain,
			userParams
		)

		const fetchedReports = result.results

		console.log("신고 내역 응답 ", fetchedReports)

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.JSON
		)

		res.status(consts.STATUS_CODE.OK)
			.send(JSON.stringify({
				reports : fetchedReports
			}))


	} catch (e) {

		console.log("error - ",e)

		res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
		.send("서버 오류")
	}
}

const isReportInfoSent = (req) => {
	return  (("spam_domain" in req.body) && req.body.spam_domain != null)
		// && (("user_id" in req.body) && req.body.user_id != null)
		&& (("title" in req.body) && req.body.title != null)
		&& (("content" in req.body) && req.body.content != null)
}

const isCreatedOk = (result) => {
	return result.results.affectedRows == 1
}


// GET
exports.getReports = async (req, res) => {

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

		console.log("신고 내역 가져오기 요청 들어옴 ")

		var conn = await db.getConn()

		var userParams = []
		var query = db.query.report.get

		if (tokenResult.isAdmin){
			query = db.query.report.getAll
		} else {
			userParams.push(tokenResult.userId)
		}
		
		const result = await conn.sendQuery(
			query,
			userParams
		)

		const fetchedReports = result.results

		console.log("신고 내역 요청 응답 ", fetchedReports)

		const payload = {
			email: tokenResult.email,
			userId: tokenResult.userId,
			isAdmin: tokenResult.isAdmin
		}

		token = await auth.publishJwt(payload)

		res.setHeader(consts.HEADER.AUTH, token)

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.JSON
		)

		res.status(consts.STATUS_CODE.OK)
			.send(JSON.stringify({
				reports : fetchedReports
			}))


	} catch (e) {

		console.log("error - ",e)

		res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
		.send("서버 오류")
	}
}

// For Admin User
exports.createReport = async (req, res) => {

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

		var conn = await db.getConn()

		// body 검사하기
		if (!isReportInfoSent(req)){
			
			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("신고 데이터 부족")

			return
		}

		console.log("토큰 체크 결과", tokenResult)

		// TO-DO : 로그인 토큰 확인

		const url = new URL(req.body.spam_domain)

		const userParams = [
			url.hostname,
			// req.body.user_id,
			tokenResult.userId,
			req.body.title,
			req.body.content
		]
		
		const result = await conn.sendQuery(
			db.query.report.create,
			userParams
		)		

		const payload = {
			email: tokenResult.email,
			userId: tokenResult.userId,
			isAdmin: tokenResult.isAdmin
		}

		token = await auth.publishJwt(payload)

		res.setHeader(consts.HEADER.AUTH, token)
		

		if (isCreatedOk(result)){
			
			res.status(consts.STATUS_CODE.OK)
				.send("신고 성공")

		} else {

			res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
				.send("생성 실패")
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


const isReportUpdateInfoSent = (req) => {
	return (("title" in req.body) && req.body.title != null)
		&& (("content" in req.body) && req.body.content != null)
}

const isUpdatedOk = (result) => {
	return result.results.affectedRows == 1
}

// For Admin User
exports.updateReport = async (req, res) => {

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


		if (!isReportUpdateInfoSent(req)){
	
			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("신고 수정 데이터 부족")

			return
		}

		// TO-DO : 자신의 신고내역인지도 확인할 필요가 있다.
		//
		
		var conn = await db.getConn()

		const userParams = [
			req.body.title,
			req.body.content,
			req.params.reportId // 없을 경우 이 핸들러로 들어오지 못함
		]
		
		const result = await conn.sendQuery(
			db.query.report.update,
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
				.send("신고 내역 수정 성공")

		} else {

			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("신고 내역 수정 실패")
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

		// TO-Do : 자신의 신고내역인지 확인할 필요가 있다


		var conn = await db.getConn()

		const userParams = [
			req.params.reportId
		]
		
		const result = await conn.sendQuery(
			db.query.report.delete,
			userParams
		)

		const payload = {
			email: tokenResult.email,
			userId: tokenResult.userId,
			isAdmin: tokenResult.isAdmin
		}

		token = await auth.publishJwt(payload)

		res.setHeader(consts.HEADER.AUTH, token)

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		// console.log("삭제 결과 ", result)

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
