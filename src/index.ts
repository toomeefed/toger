import Logger from './logger';
import { IOptions, ILogFn, LOGLEVELS } from './types';

export function toger<T extends string, U = { [K in T]: ILogFn }>(options: { levels: T[] } & IOptions): U;
export function toger<U = { [K in LOGLEVELS]: ILogFn }>(options?: IOptions): U;
export function toger(options?: IOptions) {
  return new Logger(options);
}

export default toger;
