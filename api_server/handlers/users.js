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

		if (result.results.length > 0){
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

			const payload = {
				email: req.body.email,
				userId : result.results[0].id
			}

			const token = await auth.publishJwt(payload)

			const user = result.results[0]

			res.setHeader(
				consts.HEADER.CONTENT_TYPE,
				consts.HEADER.JSON
			)

			res.setHeader(consts.HEADER.AUTH, token)

			res.status(consts.STATUS_CODE.OK)
				.send(JSON.stringify({
					userName: user.name,
					userId : user.id
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
