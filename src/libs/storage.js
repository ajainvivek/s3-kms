import AWS from 'aws-sdk';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
AWS.config.region = process.env.AWS_REGION;
AWS.config.apiVersions = {
  s3: '2006-03-01',
};

// const s3 = new AWS.S3().describeInstances();

// /**
//  * Download objects from S3
//  */
// const downloadObject = () => {
//   // TODO: s3.getObject
// };

// /**
//  * List objects from S3
//  */
// const listObjects = () => {
//   // TODO: s3.listObjects
// };
