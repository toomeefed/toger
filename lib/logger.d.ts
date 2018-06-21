import { IOptions } from './types';
declare class Logger {
    /**
     * 日志配置
     */
    options: Required<IOptions>;
    /**
     * 日志输出流
     */
    private stream;
    /**
     * 日志等级
     */
    private level;
    /**
     * 构造函数
     * @param options 配置参数
     */
    constructor(options?: IOptions);
    /**
     * 初始化函数
     */
    private init;
    private printType;
}
export default Logger;
