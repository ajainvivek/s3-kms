import dotenv from 'dotenv';

dotenv.config();
const globals = {
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  awsS3Config: process.env.AWS_S3_CONFIG
    ? JSON.parse(process.env.AWS_S3_CONFIG)
    : '{}',
  enableMetrics: process.env.ENABLE_METRICS,
  incomingBucket: process.env.INCOMING_BUCKET,
  outgoingBucket: process.env.OUTGOING_BUCKET,
  uploadConcurrency: process.env.UPLOAD_CONCURRENCY,
  downloadConcurrency: process.env.DOWNLOAD_CONCURRENCY,
  localProjectFolder: process.env.LOCAL_PROJECT_FOLDER,
};

export default globals;
