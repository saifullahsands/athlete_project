const { Errorhandler } = require("../utils/index")
const globalMiddleware = async (error, req, res, next) => {
    const status = error.status || 500
    const message = error.message || "Something went wron"
   return Errorhandler(res, status, message)
}

module.exports = globalMiddleware
