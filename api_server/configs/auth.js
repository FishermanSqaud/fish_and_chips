const jwt = require('jsonwebtoken')
const consts = require('../configs/constants')
require('dotenv').config()


exports.publishJwt = async (payload) => {
    return jwt.sign(
        payload,
        process.env.SIGN_IN_SECRET,
        {
            expiresIn: consts.TOKEN_EXPIRATION
        }
    )
}

exports.checkToken = async (token) => {

    try {

        if (token == null || token == "") {

            return {
                status: false
            }
        }

        const tokens = token.split(' ')
        if (tokens.length != 2
            || tokens[0] != consts.HEADER.BEARER) {

            return {
                status: false
            }
        }

        token = tokens[1]

        const decoded = jwt.verify(
            token,
            process.env.SIGN_IN_SECRET
        )

        if (decoded) {
            return {
                status: true,
                email: decoded.email
            }

        } else {
            return {
                status: false
            }
        }

    } catch (e) {
        throw e
    }
}

