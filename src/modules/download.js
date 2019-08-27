import { listObjects } from '../libs/storage';

/**
 * Copy S3 bucket in local
 */
export const execute = async () => {
  const objects = await listObjects('az-normal-bucket');
  console.log(objects);
};
