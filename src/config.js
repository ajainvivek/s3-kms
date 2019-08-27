import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();
logger.info(process.env.AWS_S3_CONFIG)
const globals = {
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  awsS3Config: JSON.parse(process.env.AWS_S3_CONFIG),
};

export default globals;
