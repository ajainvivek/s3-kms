import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 's3-kms',
  level: 'info',
});

export default logger;
