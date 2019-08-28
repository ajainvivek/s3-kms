import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import logger from './../utils/logger';

const mkdir = Promise.promisify(fs.mkdir);

// Create directory
export const createDirectory = async dir => {
  try {
    return await mkdir(dir, { recursive: true });
  } catch (err) {
    logger.error(
      {
        stack: err.stack,
      },
      'Failed to create directory'
    );
    throw err;
  }
};

// Get current directory
export const getCWD = () => {
  return process.cwd();
};

// Get directory from path
export const getDirectoryFromPath = filePath => {
  return path.dirname(filePath);
};

// Get file from path
export const getBaseName = filePath => {
  return path.basename(filePath);
};
