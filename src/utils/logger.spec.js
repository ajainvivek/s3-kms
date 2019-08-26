import logger from './logger';

test('Logger', () => {
  expect(logger.info).toBeDefined();
  expect(logger.error).toBeDefined();
  expect(logger.warn).toBeDefined();
});
