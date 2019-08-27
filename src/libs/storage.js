import AWS from 'aws-sdk';
import logger from './../utils/logger';
import config from './../config';

AWS.config = new AWS.Config({
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.awsRegion,
  setPromisesDependency: require('bluebird'),
});

const s3 = new AWS.S3(config.awsS3Config);

/**
 * Download objects from S3
 */
const downloadObject = async () => {
  // TODO: s3.getObject
};

/**
 * List objects from S3
 */
const listObjects = async bucket => {
  try {
    const listObjectsV2 = s3
      .listObjectsV2({
        Bucket: bucket,
      })
      .promise();
    const objects = await listObjectsV2;
    return objects;
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
