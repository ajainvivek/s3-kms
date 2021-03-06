jest.mock('aws-sdk');

const AWS = require('aws-sdk');

let s3ValidBucketPromise = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({
    IsTruncated: false,
    Contents: [
      {
        Key: 'one.txt',
        LastModified: '2019-08-26T12:55:45.475Z',
        ETag: 'bc21e6484530fc9d0313cb816b733396',
        Size: 3,
        StorageClass: 'STANDARD',
      },
      {
        Key: 'src/assets/three.txt',
        LastModified: '2019-08-26T12:55:45.480Z',
        ETag: '413af0de1f97a2155acf2b8b26ab36e2',
        Size: 5,
        StorageClass: 'STANDARD',
      },
    ],
  }),
});

const s3InvalidBucketPromise = jest.fn().mockReturnValue({
  promise: jest.fn().mockRejectedValue({
    message: 'The specified bucket does not exist',
    code: 'NoSuchBucket',
    region: null,
    time: '2019-08-28T02:15:52.946Z',
    requestId: null,
    extendedRequestId: undefined,
    cfId: undefined,
    statusCode: 404,
    retryable: false,
    retryDelay: 93.61677478550354,
  }),
});

const s3GetObject = jest.fn().mockReturnValue({
  createReadStream: jest.fn().mockReturnValue({
    on: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnValue({
        pipe: jest.fn(),
      }),
    }),
  }),
});

describe('Storage', () => {
  let storage;
  beforeEach(() => {
    AWS.S3 = jest.fn().mockImplementation(() => ({
      listObjectsV2: s3ValidBucketPromise,
      getObject: s3GetObject,
    }));
    AWS.Config = jest.fn();
    storage = require('./storage');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and list objects from s3', async () => {
    expect.assertions(1);

    const validBucket = [
      {
        key: 'one.txt',
        etag: 'bc21e6484530fc9d0313cb816b733396',
      },
      {
        key: 'src/assets/three.txt',
        etag: '413af0de1f97a2155acf2b8b26ab36e2',
      },
    ];
    const result = await storage.listObjects('valid-bucket');
    expect(validBucket).toEqual(result);
  });

  it('should throw error if invalid bucket name is passed', async () => {
    expect.assertions(1);
    AWS.S3 = jest.fn().mockImplementation(() => ({
      listObjectsV2: s3InvalidBucketPromise,
    }));
    const expected = {
      message: 'The specified bucket does not exist',
      code: 'NoSuchBucket',
      region: null,
      time: '2019-08-28T02:15:52.946Z',
      requestId: null,
      extendedRequestId: undefined,
      cfId: undefined,
      statusCode: 404,
      retryable: false,
      retryDelay: 93.61677478550354,
    };
    try {
      await storage.listObjects('invalid-bucket');
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });

  it('should get object and write to stream', async () => {
    expect.assertions(1);

    storage.downloadObject('key');
    expect(s3GetObject).toHaveBeenCalled();
  });
});
