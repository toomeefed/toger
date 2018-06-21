export interface IStreamOptions {
    /**
     * 日志目录
     */
    dir?: string;
    /**
     * 文件名
     */
    filename?: string;
    /**
     * 缓存刷新时间
     */
    cache?: number;
    /**
     * linux 文件模式
     */
    mode?: number;
}
export interface IOptions {
    /**
     * 输出级别
     */
    level?: string;
    /**
     * 日志级别
     */
    levels?: string[];
    /**
     * 输出JSON格式
     */
    json?: boolean;
    /**
     * 输出时间戳
     */
    stamp?: boolean;
    /**
     * 输出到文件
     */
    stream?: true | IStreamOptions;
}
/**
 * 混合配置
 */
export declare type StreamOptions = Required<IOptions & IStreamOptions & {
    level: number;
}>;
/**
 * 日志方法
 */
export interface ILogFn {
    /**
     * 输出日志
     * (第二个参数开始，继承自 util.format 格式)
     *
     * ```js
     * const logger = toger({ json: true });
     * logger.info({ hello: 'world' }, 'haha');
     * // {"time":"2018-06-01 10:00:00","level":"INFO","message":"haha","hello":"world"}
     * logger.info({ hello: 'world' }, 'haha', { hello: 'world' });
     * // {"time":"2018-06-01 10:00:00","level":"INFO","message":"haha { hello: 'world' }","hello":"world"}
     * logger.info({ hello: 'world' }, 'haha %j', { hello: 'world' });
     * // {"time":"2018-06-01 10:00:00","level":"INFO","message":"haha {\"hello\":\"world\"}","hello":"world"}
     * ```
     */
    (data: object, ...args: any[]): void;
    /**
     * 输出日志
     * (参数继承自 util.format 格式)
     *
     * ```js
     * const logger = toger();
     * logger.info('haha');
     * // [2018-06-01 10:00:00] INFO haha
     * logger.warn('haha', { str: 'str' });
     * // [2018-06-01 10:00:00] WARN haha { str: 'str' }
     * logger.error('haha %j', { str: 'str' });
     * // [2018-06-01 10:00:00] ERROR haha {"str":"str"}
     * ```
     */
    (...args: any[]): void;
}
/**
 * 默认日志级别
 */
export declare type LOGLEVELS = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
