import * as download from './modules/download';

// copy s3 bucket objects recursively in local
export const copyS3Bucket = () => {
  download.execute();
};
