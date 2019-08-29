import { getCWD, getFiles } from '../libs/file';
import { uploadFile } from '../libs/storage';
import Promise from 'bluebird';
import shortid from 'shortid';
import config from './../config';

// Upload file to S3
export const _uploadFiles = files => {
  const uniqueDirId = shortid.generate();
  return Promise.map(
    files,
    file => {
      const key = file.replace(`${getCWD()}/`, '').replace('.tmp', uniqueDirId);
      return uploadFile(config.outgoingBucket, key, file);
    },
    {
      concurrency: parseFloat(config.uploadConcurrency),
    }
  );
};

// Execute: Recursively upload files in batch to S3
export const execute = async () => {
  const tmpDir = `${getCWD()}/.tmp`;
  const files = await getFiles(tmpDir);
  return _uploadFiles(files);
};
