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

    // Promise.all without any concurrency
    // const files = [];
    // objects.forEach(object => {
    //   files.push(downloadFile(object.key));
    // });
    // Promise.all(files);
    // Measurements: 33.30, 29.35, 30.35

    return Promise.map(
      objects,
      object => {
        return _downloadFile(object.key);
      },
      {
        concurrency: parseFloat('Infinity'),
      }
    );
    // Measurements with concurrency infinity: 27.78, 26.68, 27.57
    // Measurements with concurrency 3: 29.67, 29.46, 28.74
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
measure(execute);
