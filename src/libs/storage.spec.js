jest.mock('aws-sdk');

const AWS = require('aws-sdk');

let s3Promise = jest.fn().mockReturnValue({
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

const s3InvalidPromise = jest.fn().mockReturnValue({
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

AWS.S3 = jest.fn().mockImplementation(() => ({
  listObjectsV2: s3Promise,
}));

AWS.Config = jest.fn();

describe('Storage', () => {
  let storage;
  beforeEach(() => {
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
      listObjectsV2: s3InvalidPromise,
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
});
