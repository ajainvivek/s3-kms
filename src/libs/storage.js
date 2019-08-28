import AWS from 'aws-sdk';
import logger from './../utils/logger';
import config from './../config';

AWS.config = new AWS.Config({
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.awsRegion,
  setPromisesDependency: require('bluebird'),
});

/**
 * Download objects from S3
 */
const downloadObject = async () => {
  return {};
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

export { downloadObject, listObjects };
