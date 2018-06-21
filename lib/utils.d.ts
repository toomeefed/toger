/// <reference types="node" />
/**
 * 当前时间
 * @param type 返回格式控制
 */
export declare function now(type?: string): string | number;
/**
 * 按级别返回标准 输出/错误 流 (用于日志分级，如 pm2 日志)
 * @param level 日志类别
 */
export declare function getStdio(level: string): NodeJS.WriteStream;
/**
 * 空函数
 */
export declare function noop(): void;
