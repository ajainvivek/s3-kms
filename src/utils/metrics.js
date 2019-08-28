import { performance, PerformanceObserver } from 'perf_hooks';
import logger from './logger';

/**
 * Measures the running of he wrapper function
 * @param {Func} method to be measure
 */
export const measure = (method, enabled) => {
  if (enabled) {
    const wrapped = performance.timerify(method);

    const obs = new PerformanceObserver(list => {
      logger.info(
        {
          name: list.getEntries()[0].name,
          duration: list.getEntries()[0].duration,
        },
        'Performance measurement'
      );
      obs.disconnect();
    });

    obs.observe({ entryTypes: ['function'] });

    wrapped();
  }
};
