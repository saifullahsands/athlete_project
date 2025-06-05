const { S3Client } = require("@aws-sdk/client-s3");
const {
  ACCESS_KEY_ID,
  BUCKET_REGION,
  SECRET_ACCESS_KEY,
} = require("../config/env.config");

const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION,
});

module.exports = s3;
