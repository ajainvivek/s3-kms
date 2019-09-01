// upload integration spec
import AWS from 'aws-sdk';
import config from './../../src/config';
import { getCWD } from './../../src/libs/file';
import readdir from 'recursive-readdir';
const s3 = new AWS.S3(config.awsS3Config);
const mockDirName = 'testing_s3_kms_upload';

const cleanS3MockFolder = async () => {
  const listParams = {
    Bucket: config.outgoingBucket,
    Prefix: `${mockDirName}/`,
  };

  try {
    const listObjectsV2 = s3.listObjectsV2(listParams).promise();
    const { Contents } = await listObjectsV2;
    const deleteParams = { Bucket: config.outgoingBucket };
    deleteParams.Delete = { Objects: [] };

    Contents.forEach(function(content) {
      deleteParams.Delete.Objects.push({ Key: content.Key });
    });
    const deleteObjects = s3.deleteObjects(deleteParams).promise();
    await deleteObjects;
  } catch (err) {
    console.error(err);
  }
};

describe('Upload integration', () => {
  let upload;
  const filesDir = `${getCWD()}/localstack/sample/my-project`;

  beforeEach(() => {
    upload = require('./../../src/modules/upload');
  });

  afterAll(async () => {
    await cleanS3MockFolder();
    jest.clearAllMocks();
  });

  it('should upload files recursively from local machine dir to s3 bucket', async () => {
    expect.assertions(2);
    await upload.execute(mockDirName);

    const localFiles = await readdir(filesDir);
    const listObjectsV2 = s3
      .listObjectsV2({
        Bucket: config.outgoingBucket,
        Prefix: `${mockDirName}/`,
      })
      .promise();
    const { Contents } = await listObjectsV2;

    expect(Contents.length).toBeGreaterThan(1);
    expect(Contents.length).toEqual(localFiles.length);
  });
});
