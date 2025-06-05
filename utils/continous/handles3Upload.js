const s3 = require("../../config/s3.config");
const { S3_ACCESS_URL } = require("../../config/env.config");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const handleS3Upload = async (filename, file, folder) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `${folder}/${filename}`,
      ContentType: file.mimetype,
      Body: file.buffer,
    });
    await s3.send(command);
    return `${S3_ACCESS_URL}/${folder}/${filename}`;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  handleS3Upload,
};
