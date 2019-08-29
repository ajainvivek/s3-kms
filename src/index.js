import * as download from './modules/download';
import * as upload from './modules/upload';
import logger from './utils/logger';

// copy s3 bucket objects recursively in local
export const copyS3Bucket = () => {
  try {
    download.execute();
  } catch (err) {
    logger.error(
      {
        stack: err.stack,
      },
      'Failed to copy s3 bucket to local'
    );
  }
};

// Upload directory to encrypted s3 bucket
export const uploadDirToS3 = async () => {
  try {
    upload.execute();
  } catch (err) {
    logger.error(
      {
        stack: err.stack,
      },
      'Failed to upload to s3 bucket from local'
    );
  }
};
