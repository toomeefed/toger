import { IOptions, ILogFn, LOGLEVELS } from './types';
export declare function toger<T extends string, U = {
    [K in T]: ILogFn;
}>(options: {
    levels: T[];
} & IOptions): U;
export declare function toger<U = {
    [K in LOGLEVELS]: ILogFn;
}>(options?: IOptions): U;
export default toger;
