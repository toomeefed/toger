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
export declare type LogFn = (data?: object, ...args: any[]) => void;
