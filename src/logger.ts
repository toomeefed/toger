import { EOL } from 'os';
import { format } from 'util';
import LogStream from './logstream';
import { now, noop, getStdio } from './utils';
import { IOptions, LogFn } from './types';

class Logger {
  /**
   * 日志配置
   */
  public options: Required<IOptions>;

  /**
   * 日志输出流
   */
  private stream: null | LogStream | NodeJS.WriteStream;

  /**
   * 日志等级
   */
  private level: number;

  /**
   * 构造函数
   * @param options 配置参数
   */
  constructor(options?: IOptions) {
    this.options = Object.assign(
      {
        level: 'all',
        levels: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
        json: false, // json 格式
        stamp: false, // 时间戳
        stream: null, // 写到文件配置
      },
      options,
    );

    this.stream = null;
    this.level = -1;

    this.init();
  }

  /**
   * 初始化函数
   */
  private init() {
    const { level, levels, stream } = this.options;
    if (level === 'all') {
      this.level = -1;
    } else if (level === 'off') {
      this.level = Infinity;
    } else {
      this.level = levels.indexOf(level);
    }

    if (stream) {
      const opts = Object.assign({}, this.options, stream, { level: this.level });
      this.stream = new LogStream(opts);
    } else {
      this.stream = getStdio(level);
    }

    const self = this as any;
    levels.forEach((levelName) => {
      self[levelName] = this.printType(levelName);
    });
  }

  private printType(level: string): LogFn {
    const LEVEL = level.toUpperCase();
    if (this.level > this.options.levels.indexOf(level)) {
      return noop;
    }

    const { stream } = this;

    // 时间格式控制
    const time = () => (this.options.stamp ? now() : now('datetime'));

    // 日志输出格式控制
    const makeData = this.options.json
      ? (message: string, data?: object): string =>
          JSON.stringify(
            Object.assign({ time: time(), level: LEVEL, message }, data),
          ) + EOL
      : (message: string, data?: object): string =>
          `[${time()}] ${LEVEL} ${message}${
            data ? ` - ${JSON.stringify(data)}` : ''
          }${EOL}`;

    return (data, ...args) => {
      let message;
      if (typeof data === 'object' && data !== null) {
        message = makeData(format.call(null, ...args), data);
      } else {
        message = makeData(format.call(null, data, ...args));
      }
      (stream as any).write(message, { level } as any);
    };
  }
}

export default Logger;