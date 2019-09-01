import { getCWD, getFiles } from '../libs/file';
import { uploadFile } from '../libs/storage';
import Promise from 'bluebird';
import shortid from 'shortid';
import config from './../config';
import { measure } from './../utils/metrics';

// Upload file to S3
export const _uploadFiles = (files, rootFolder) => {
  const uniqueDirId = rootFolder || shortid.generate();
  return Promise.map(
    files,
    file => {
      const key = file
        .replace(`${getCWD()}`, '')
        .replace(config.localProjectFolder, uniqueDirId);
      return uploadFile(config.outgoingBucket, key, file);
    },
    {
      concurrency: parseFloat(config.uploadConcurrency),
    }
  );
};

// Execute: Recursively upload files in batch to S3
export const execute = async (rootFolder = '') => {
  const tmpDir = `${getCWD()}${config.localProjectFolder}`;
  const files = await getFiles(tmpDir);
  return _uploadFiles(files, rootFolder);
};

// Measure method, if metrics is enabled
measure(execute, config.enableMetrics);
