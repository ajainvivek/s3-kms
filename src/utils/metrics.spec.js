jest.mock('perf_hooks');

const perf = require('perf_hooks');
const metrics = require('./metrics');
const config = require('./../config');

describe('Metrics', () => {
  beforeEach(() => {
    perf.performance = {
      timerify: jest.fn().mockImplementation(callback => {
        return callback;
      }),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should start observing and measuring metrics for fn when enabled', () => {
    expect.assertions(2);
    const mockFunc = jest.fn();
    metrics.measure(mockFunc, true);
    expect(perf.performance.timerify).toHaveBeenCalled();
    expect(mockFunc).toHaveBeenCalled();
  });

  it('should not start observing and measuring metrics for fn when disabled', () => {
    expect.assertions(2);
    config.enableMetrics = false;
    const mockFunc = jest.fn();
    metrics.measure(mockFunc, false);
    expect(perf.performance.timerify).not.toHaveBeenCalled();
    expect(mockFunc).not.toHaveBeenCalled();
  });
});
