import { IStreamOptions } from './types';
declare class LogStream {
    /**
     * 配置参数
     */
    options: Required<IStreamOptions>;
    /**
     * 可写流 Map
     */
    private streams;
    /**
     * 缓存 Map
     */
    private caches;
    /**
     * 是否缓存
     */
    private isCache;
    /**
     * 定时刷新
     */
    private flushTimer;
    /**
     * 构造函数
     * @param options 配置参数
     */
    constructor(options?: IStreamOptions);
    /**
     * 初始化
     */
    private init;
    /**
     * 写到日志文件
     * @param data 日志数据
     * @param param 参数
     */
    write(data: string, { level }: {
        level: string;
    }): void;
    /**
     * 刷新到文件
     * @param level 类型
     */
    flush(level?: string): void;
    /**
     * 关闭文件流
     */
    close(): void;
}
export default LogStream;
