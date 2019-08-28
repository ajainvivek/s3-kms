jest.mock('../libs/file');
jest.mock('../libs/storage');
jest.mock('fs');
jest.mock('process');

const file = require('../libs/file');
const storage = require('../libs/storage');
const fs = require('fs');

process.env = {
  INCOMING_BUCKET: 'test',
};

describe('Download module', () => {
  let download;
  beforeEach(() => {
    download = require('./download');
    file.getDirectoryFromPath = jest.fn().mockReturnValue('tmp');
    file.getCWD = jest.fn().mockReturnValue('/src');
    file.getBaseName = jest.fn().mockReturnValue('file.txt');
    file.createDirectory = jest.fn().mockResolvedValue(true);
    fs.createWriteStream = jest.fn().mockReturnValue('stream');
    storage.downloadObject = jest.fn();
    storage.listObjects = jest.fn().mockResolvedValue([
      {
        key: 'key1',
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should download and copy a single file to local', async () => {
    expect.assertions(6);
    const mockKey = '/some/path/file.txt';

    await download._downloadFile(mockKey);
    expect(file.getDirectoryFromPath).toHaveBeenCalledWith(mockKey);
    expect(file.getCWD).toHaveBeenCalled();
    expect(file.getBaseName).toHaveBeenCalledWith(mockKey);
    expect(file.createDirectory).toHaveBeenCalledWith('/src/.tmp/tmp');
    expect(fs.createWriteStream).toHaveBeenCalledWith('/src/.tmp/tmp/file.txt');
    expect(storage.downloadObject).toHaveBeenCalledWith(
      'test',
      '/some/path/file.txt',
      'stream'
    );
  });

  it('should recursively copy files and dir to local machine', async () => {
    expect.assertions(1);
    download._downloadFile = jest.fn().mockResolvedValue('file');
    download.execute();
    expect(storage.listObjects).toHaveBeenCalledWith('test');
  });

  it('should throw error when api call fails', async () => {
    expect.assertions(1);
    storage.listObjects = jest.fn().mockRejectedValue('failed');
    try {
      await download.execute();
    } catch (err) {
      expect(err).toEqual('failed');
    }
  });
});
