jest.mock('../libs/file');
jest.mock('../libs/storage');
jest.mock('process');
jest.mock('shortid');

const storage = require('../libs/storage');
const shortid = require('shortid');
const file = require('../libs/file');

process.env = {
  OUTGOING_BUCKET: 'test',
  UPLOAD_CONCURRENCY: 1,
  LOCAL_PROJECT_FOLDER: '/tmp',
};

describe('Upload module', () => {
  let upload;
  beforeEach(() => {
    upload = require('./upload');
    shortid.generate = jest.fn();
    file.getCWD = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload files to s3 bucket with unique dir name', async () => {
    expect.assertions(2);
    storage.uploadFile = jest.fn().mockResolvedValue(true);
    const mockFiles = ['/some/path/file.txt', '/some/file2.txt'];
    await upload._uploadFiles(mockFiles);

    expect(shortid.generate).toHaveBeenCalled();
    expect(storage.uploadFile).toHaveBeenCalled();
  });

  it('should upload files the total files', async () => {
    expect.assertions(1);
    storage.uploadFile = jest.fn().mockResolvedValue(true);
    const mockFiles = ['/some/path/file.txt', '/some/file2.txt'];

    let totalPromises = await upload._uploadFiles(mockFiles);
    expect(totalPromises.length).toEqual(2);
  });

  it('should get files from the tmp dir and uplod the files to S3', async () => {
    expect.assertions(2);
    const rootPath = '/src';
    const mockFiles = ['/some/path/file.txt', '/some/file2.txt'];
    file.getCWD = jest.fn().mockReturnValue(rootPath);
    file.getFiles = jest.fn().mockResolvedValue(mockFiles);

    await upload.execute();

    expect(file.getCWD).toHaveBeenCalled();
    expect(file.getFiles).toHaveBeenCalledWith(`${rootPath}/tmp`);
  });
});
