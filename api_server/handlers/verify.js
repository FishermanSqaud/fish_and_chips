const consts = require('../configs/constants')
const https = require('https')
const cert = require('../certificate/cert')
require('dotenv').config()


// 목적 : 사이트가 올바른 CA인증서를 사용하는지 확인
//       - 피싱사이트여도 HTTPS/CA 인증서를 사용할 수 있다.
//       - 정상사이트여도 HTTPS/CA 인증서를 사용하지 않을 수 있다.
//        => 피싱사이트 검출이 목적이 아닌, 개인정보 입력을 지양하도록 권고
//        => 사용자 신고 내역과 종합하여 보다 종합적으로 권고 예정
//         
// 로직 : 1. 사용자한테 검사할 사이트 도메인을 바디로 받는다.
//       2. 확인을 요첩 받은 사이트에 요청/응답을 시도한다.
//       3-1. 커넥션간 인증서가 없을 경우 CA인증서 미사용 => 클라이언트에게 위험 응답
//       3-2. 커넥션간 인증서가 존재할 경우, 인증서에 명시된 상위 인증기관의 인증서를 재귀적으로 획득
//        3-2-1. 루트 인증기관(CA)의 인증서를 획득하게 되면, 가지고 있는 인증기관들의 공개키(공개 인증서)들과 비교, 검증
//        3-2-2. 상위 인증기관의 인증서 대신 OCSP (인증서 검출 프로토콜) 를 요청받을 경우, 일단 올바른 사이트로 응답
//                (추후 OCSP 인증 기능까지 완료하여 추가해야함)
//
exports.verify = async (req, res) => {

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

		const uri = req.body.uri

		const options = await cert.makeRequestOption(uri)

		const requestToDoubtSite = https.request(
			options, 
			async (responseFromDoubt) => {

				const rawCertBuf = await cert.getCertificateBuf(
					responseFromDoubt
				)

				if (rawCertBuf == null || rawCertBuf == undefined){

					res.setHeader(
						consts.HEADER.CONTENT_TYPE,
						consts.HEADER.TEXT
					)
		
					res.status(consts.STATUS_CODE.BAD_REQUEST)
						.send("Unable to get certificate from URL - Private Usage?")

					return
				}

				const certificate = await cert.makeCertificate(
					rawCertBuf
				)

				const rootCa = await cert.getRootCaCertFrom(
					certificate
				)

				if (rootCa != null) {

					const isVerified = await cert.verify(rootCa)

					res.status(consts.STATUS_CODE.OK)
						.send(JSON.stringify({
							result : isVerified
						}))

				} else {

					// bad response
					res.status(consts.STATUS_CODE.OK)
						.send(JSON.stringify({
							result : false
						}))
				}
		})

		requestToDoubtSite.on('error', e => {

			res.status(consts.STATUS_CODE.OK)
				.send(JSON.stringify({
					result : false
				}))
		})

		requestToDoubtSite.end()

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
