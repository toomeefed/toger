import Logger from './logger';
import { IOptions } from './types';

export function logger(options?: IOptions): Logger {
  return new Logger(options);
}

export default logger;
