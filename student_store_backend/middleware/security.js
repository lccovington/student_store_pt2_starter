const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")
const { UnauthorizedError } = require("../utils/errors")

const jwtForm = ({ headers }) => {

    if (headers.authorization) {
        const [ scheme, token ] = headers.authorization.split(" ")

        if (scheme.trim() === "Bearer") {
            return token
        }
    }

    return null
}

const extractUserFromJwt = (req, res, next) => {
    try {
        const token = jwtForm(req)
        if (token) {
            res.locals.user = jwt.verify(token, SECRET_KEY)
        }

    } catch (error) {
        return next()
    }
}

const requireAuthenticatedUser = (req, res, next) => {
    try {
        const user = res.locals
        if (user?.email) {
            throw new UnauthorizedError()
        }
        return next()

    } catch (error) {
        return next()
    }
}

module.exports ={
    jwtForm,
    extractUserFromJwt,
    requireAuthenticatedUser
}