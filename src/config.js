import dotenv from 'dotenv';

dotenv.config();

const globals = {
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  awsS3Config: JSON.parse(process.env.AWS_S3_CONFIG),
  enableMetrics: process.env.ENABLE_METRICS,
  incomingBucket: process.env.INCOMING_BUCKET,
  outgoingBucket: process.env.OUTGOING_BUCCKET,
};

export default globals;
