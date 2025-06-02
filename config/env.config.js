const path=require("path")

require("dotenv").config({
    path:path.resolve(__dirname,"../.env")
})

module.exports={
    PORT:process.env.PORT,
    PASSWORD:process.env.PASSWORD,
    EMAIL:process.env.EMAIL,
    TOKEN_SECRET_KEY:process.env.TOKEN_SECRET_KEY,
    TOKEN_EXPIRY:process.env.TOKEN_EXPIRY
}