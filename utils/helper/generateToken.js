const JWT = require("jsonwebtoken")
const { TOKEN_EXPIRY, TOKEN_SECRET_KEY } = require("../../config/env.config");

const generateToken = (userId) => {
    return JWT.sign({
        id: userId,
    }, TOKEN_SECRET_KEY,
        {
            expiresIn: TOKEN_EXPIRY
        }
    )
}

module.exports = {
    generateToken
}