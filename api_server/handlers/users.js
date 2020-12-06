const db = require('../configs/db')
const auth = require('../configs/auth')
const consts = require('../configs/constants')
require('dotenv').config()

const isEmailDuplicate = async (email) => {

	try {

		var conn = await db.getConn()

		const userParams = [
			email
		]

		const result = await conn.sendQuery(
			db.query.user.get,
			userParams
		)

		if (result.results.length > 0) {
			return true
		}

		return false

	} catch (e) {
		throw e
	}


}

exports.signUp = async (req, res) => {

	try {

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		if (!isSignUpInfoSent(req)) {
			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("회원가입 데이터 부족")

			return
		}

		console.log("회원가입 요청 받음")


		if (await isEmailDuplicate(req.body.email)) {

			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("중복된 정보입니다")

			return
		}

		var conn = await db.getConn()

		const userParams = [
			req.body.email,
			req.body.password,
			req.body.name
		]

		// TO-DO :이미 회원가입 되어 있는 정보인지 확인 해야함

		const result = await conn.sendQuery(
			db.query.user.create,
			userParams
		)

		console.log("회원가입 결과", result)

		res.status(consts.STATUS_CODE.OK)
			.send("회원가입 성공")

	} catch (e) {

		console.log("error in signup", e)

		res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
			.send("서버 오류")

	}

}

const isUserExist = (result) => {
	return result.results.length == 1
}

exports.signIn = async (req, res) => {

	try {

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		if (!isSignInInfoSent(req)) {
			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("로그인 데이터 부족")

			return
		}


		console.log("로그인 요청 받음")

		var conn = await db.getConn()

		const userParams = [
			req.body.email,
			req.body.password
		]

		const result = await conn.sendQuery(
			db.query.user.getWithPwd,
			userParams
		)

		if (isUserExist(result)) {

			const user = result.results[0]

			const payload = {
				email: req.body.email,
				userId: user.id,
				isAdmin: user.is_admin
			}

			const token = await auth.publishJwt(payload)


			res.setHeader(
				consts.HEADER.CONTENT_TYPE,
				consts.HEADER.JSON
			)

			res.setHeader(consts.HEADER.AUTH, token)

			res.status(consts.STATUS_CODE.OK)
				.send(JSON.stringify({
					userName: user.name
				}))

			console.log("로그인 성공", user)

		} else {

			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("로그인 실패")

			console.log("로그인 실패")
		}


	} catch (e) {

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		console.log("error in sign in", e)

		res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
			.send("서버 오류")

	}
}


const isSignUpInfoSent = (req) => {

	return (('email' in req.body && req.body.email != '')
		&& ('password' in req.body && req.body.password != ''))
		&& (('name' in req.body) && (req.body.name != ''))
}


const isSignInInfoSent = (req) => {

	return (('email' in req.body && req.body.email != '')
		&& ('password' in req.body && req.body.password != ''))
}


// GET
exports.getUsers = async (req, res) => {

	try {

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.TEXT
		)

		if (!auth.isAccessTokenSent(req)) {

			res.status(consts.STATUS_CODE.BAD_REQUEST)
				.send("토큰 미전송")

			return
		}

		var token = req.header(consts.HEADER.AUTH)

		const tokenResult = await auth.checkToken(token)

		if (!tokenResult.status) {
			res.status(consts.STATUS_CODE.UNAUTHORIZED)
				.send("토큰 에러")

			return
		}


		if (!tokenResult.isAdmin) {
			res.status(consts.STATUS_CODE.UNAUTHORIZED)
				.send("접근 권한이 없습니다")

			return
		}

		console.log("관리자 - 사용자 가져오기")

		var conn = await db.getConn()

		const result = await conn.sendQuery(
			db.query.user.getAll,
			[],
			false
		)

		const users = result.results

		const fetchReportsPromises = users.map((user) => conn.sendQuery(
			db.query.report.get,
			[user.id],
			false
		))

		const results = await Promise.all(fetchReportsPromises)

		// Must Release connection after use
		conn.release()

		res.setHeader(
			consts.HEADER.CONTENT_TYPE,
			consts.HEADER.JSON
		)

		res.status(consts.STATUS_CODE.OK)
			.send(JSON.stringify({
				users: users.map((user, idx) => {
					return {
						...user,
						reports : results[idx].results
					}
				})
			}))


	} catch (e) {

		console.log("error - ", e)

		res.status(consts.STATUS_CODE.SERVER_INTERNAL_ERROR)
			.send("서버 오류")
	}
}