import AWS from 'aws-sdk';
import logger from './../utils/logger';
import config from './../config';
import Promise from 'bluebird';
import fs from 'fs';

AWS.config = new AWS.Config({
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.awsRegion,
  setPromisesDependency: require('bluebird'),
});

/**
 * Download objects from S3
 */
const downloadObject = async (bucket, key, file) => {
  const s3 = new AWS.S3(config.awsS3Config);

  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: bucket,
      Key: key,
    })
      .createReadStream()
      .on('end', () => resolve())
      .on('error', err => {
        logger.error(
          {
            stack: err.stack,
          },
          'Failed to download file'
        );
        return reject(err);
      })
      .pipe(file);
  });
};

/**
 * List objects from S3
 */
const listObjects = async bucket => {
  const s3 = new AWS.S3(config.awsS3Config);
  try {
    const listObjectsV2 = s3
      .listObjectsV2({
        Bucket: bucket,
      })
      .promise();
    const { IsTruncated, Contents } = await listObjectsV2;

    if (IsTruncated) {
      logger.warn('Skipped handling truncated files!!');
    }
    // filter key & etag
    return Contents.map(content => {
      return {
        key: content.Key,
        etag: content.ETag,
      };
    });
  } catch (err) {
    logger.error(
      {
        stack: err.stack,
      },
      'Failed to fetch objects'
    );
    throw err;
  }
};

/**
 * Upload file to S3
 */
const uploadFile = async (bucket, key, file) => {
  const s3 = new AWS.S3(config.awsS3Config);
  try {
    const upload = s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: fs.readFileSync(file),
      })
      .promise();

    const status = await upload;
    return status;
  } catch (err) {
    logger.error(
      {
        stack: err.stack,
      },
      'Failed to upload file'
    );
    throw err;
  }
};

export { downloadObject, listObjects, uploadFile };
