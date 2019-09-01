// download.spec.js
import AWS from 'aws-sdk';
import config from './../../src/config';
import readdir from 'recursive-readdir';
import fs from 'fs';
import { getCWD } from './../../src/libs/file';
const exec = require('child_process').exec;
const s3 = new AWS.S3(config.awsS3Config);

describe('Download integration', () => {
  let download;
  const tmpDir = `${getCWD()}/.tmp`;

  beforeEach(() => {
    download = require('./../../src/modules/download');
  });

  afterAll(async () => {
    exec(`rm -rf ${tmpDir}`, err => {
      jest.clearAllMocks();
      if (err) {
        console.error(err);
      }
    });
  });

  it('should download files from s3 bucket into `.tmp` dir recursively in local machine', async () => {
    expect.assertions(2);
    await download.execute();
    const listParams = {
      Bucket: config.incomingBucket,
    };

    const files = await readdir(tmpDir);
    const listObjectsV2 = s3.listObjectsV2(listParams).promise();
    const { Contents } = await listObjectsV2;

    expect(fs.existsSync(tmpDir)).toBeTruthy();
    expect(files.length).toEqual(Contents.length);
  });
});
