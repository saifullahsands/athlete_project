const { Errorhandler } = require("../utils/handleError")
const globalMiddleware = async (error, req, res, next) => {
    const status = error.status || 500
    const message = error.message || "Something went wron"
    Errorhandler(res, status, message)
}

module.exports = globalMiddleware
