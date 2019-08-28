const fs = require('fs');

jest.mock('fs');
jest.mock('process');

describe('File', () => {
  let file;
  let mockMkDir = jest.fn().mockResolvedValue({});
  beforeEach(() => {
    fs.mkdir = mockMkDir;
    file = require('./file');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create directory', async () => {
    expect.assertions(1);
    file.createDirectory('some/other/path');
    expect(mockMkDir).toHaveBeenCalled();
  });

  it('should return current working dir', () => {
    expect.assertions(1);
    process.cwd = jest.fn().mockReturnValue('/path/some');
    const result = file.getCWD();
    const expected = '/path/some';
    expect(expected).toEqual(result);
  });

  it('should return filename from path', () => {
    expect.assertions(1);
    const result = file.getBaseName('src/file.txt');
    const expected = 'file.txt';
    expect(expected).toEqual(result);
  });

  it('should return dir path from file path', () => {
    expect.assertions(1);
    const result = file.getDirectoryFromPath('src/some/file.txt');
    const expected = 'src/some';
    expect(expected).toEqual(result);
  });
});
