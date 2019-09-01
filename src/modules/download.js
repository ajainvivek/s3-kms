import { listObjects, downloadObject } from '../libs/storage';
import {
  getCWD,
  createDirectory,
  getDirectoryFromPath,
  getBaseName,
} from '../libs/file';
import fs from 'fs';
import logger from '../utils/logger';
import Promise from 'bluebird';
import { measure } from './../utils/metrics';
import config from './../config';

/**
 * Download file from s3 key
 * @param {string} key s3 file key path
 */
export const _downloadFile = async key => {
  const filePath = getDirectoryFromPath(key);
  const tmpDir = `${getCWD()}/.tmp`;
  const fileDir = `${tmpDir}/${filePath}`;
  const fileName = getBaseName(key);
  await createDirectory(fileDir);
  const file = fs.createWriteStream(`${fileDir}/${fileName}`);
  return downloadObject(config.incomingBucket, key, file);
};

/**
 * Copy S3 bucket in local
 */
export const execute = async () => {
  try {
    const objects = await listObjects(config.incomingBucket);
    return Promise.map(
      objects,
      object => {
        return _downloadFile(object.key);
      },
      {
        concurrency: parseFloat(config.downloadConcurrency),
      }
    );
  } catch (err) {
    logger.error(
      {
        stack: err.stack,
      },
      'Cloning S3 bucket failed'
    );
    throw err;
  }
};

// Measure method, if metrics is enabled
measure(execute, config.enableMetrics);
