import { EOL } from 'os';
import { format } from 'util';
import LogStream from './logstream';
import { now, noop, getStdio } from './utils';
import { IOptions, ILogFn } from './types';

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
      const opts = Object.assign({}, this.options, stream, {
        level: this.level,
      });
      this.stream = new LogStream(opts);
    }

    const self = this as any;
    levels.forEach((levelName) => {
      self[levelName] = this.printType(levelName);
    });
  }

  private printType(level: string): ILogFn {
    const LEVEL = level.toUpperCase();
    if (this.level > this.options.levels.indexOf(level)) {
      return noop;
    }

    // 如果没有配置输出文件，则输出到对应类型的标准流中
    const stream = this.stream || getStdio(level);

    // 时间格式控制
    const time = () => (this.options.stamp ? now() : now('datetime'));

    // 日志输出格式控制
    const makeData = this.options.json
      ? (msg: string, data?: object): string =>
          JSON.stringify(
            Object.assign({ time: time(), level: LEVEL, msg }, data),
          ) + EOL
      : (msg: string, data?: object): string =>
          `[${time()}] ${LEVEL} ${msg}${
            data ? ` - ${JSON.stringify(data)}` : ''
          }${EOL}`;

    return (data?: object, ...args: any[]): void => {
      let msg;
      if (typeof data === 'object' && data !== null) {
        msg = makeData(format.call(null, ...args), data);
      } else {
        msg = makeData(format.call(null, data, ...args));
      }
      (stream as any).write(msg, { level } as any);
    };
  }
}

export default Logger;
