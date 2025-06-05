const path=require("path")

require("dotenv").config({
    path:path.resolve(__dirname,"../.env")
})

module.exports={
    PORT:process.env.PORT,
    PASSWORD:process.env.PASSWORD,
    EMAIL:process.env.EMAIL,
    TOKEN_SECRET_KEY:process.env.TOKEN_SECRET_KEY,
    TOKEN_EXPIRY:process.env.TOKEN_EXPIRY,
    ACCESS_KEY_ID:process.env.ACCESS_KEY_ID,
    BUCKET_NAME:process.env.BUCKET_NAME,
    BUCKET_REGION:process.env.BUCKET_REGION,
    SECRET_ACCESS_KEY:process.env.SECRET_ACCESS_KEY,
    S3_ACCESS_URL:process.env.S3_ACCESS_URL
    
}