const db = require('../configs/db')
const consts = require('../configs/constants')
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
		}

		var conn = await db.getConn()

		const userParams = [
			req.body.spam_domain
		]
		
		const result = await conn.sendQuery(
			db.query.report.getWithDomain,
			userParams
		)

		const fetchedReports = result.results


		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.JSON
		)

		res.status(consts.STATUS_CODE.OK)
			.send(JSON.stringify(fetchedReports))


	} catch (e) {

		console.log("error - ",e)

		res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
		.send("서버 오류")
	}
}

const isReportInfoSent = (req) => {
	return  (("spam_domain" in req.body) && req.body.spam_domain != null)
		&& (("user_id" in req.body) && req.body.user_id != null)
		&& (("title" in req.body) && req.body.title != null)
		&& (("content" in req.body) && req.body.content != null)
}

const isCreatedOk = (result) => {
	return result.results.affectedRows == 1
}

// For Admin User
exports.createReport = async (req, res) => {

	try {

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		var conn = await db.getConn()

		// body 검사하기
		if (!isReportInfoSent(req)){
			
			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("신고 데이터 부족")

			return
		}

		const userParams = [
			req.body.spam_domain,
			req.body.user_id,
			req.body.title,
			req.body.content
		]

		// TO-DO :이미 회원가입 되어 있는 정보인지 확인 해야함
		
		const result = await conn.sendQuery(
			db.query.report.create,
			userParams
		)		
		

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

		if (!isReportUpdateInfoSent(req)){
	
			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("신고 수정 데이터 부족")

			return
		}
		
		var conn = await db.getConn()

		const userParams = [
			req.body.title,
			req.body.content,
			req.params.reportId // 없을 경우 이 핸들러로 들어오지 못함
		]

		// TO-DO :이미 회원가입 되어 있는 정보인지 확인 해야함
		
		const result = await conn.sendQuery(
			db.query.report.update,
			userParams
		)

		// console.log("수정 결과 ", result)

		if (isUpdatedOk(result)){

			res.status(consts.STATUS_CODE.OK)
				.send("신고 내역 수정 성공")

		} else {

			res.status(consts.STATUS_CODE.OK)
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

		var conn = await db.getConn()

		const userParams = [
			req.params.reportId
		]
		
		const result = await conn.sendQuery(
			db.query.report.delete,
			userParams
		)

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
