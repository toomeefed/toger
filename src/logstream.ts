import { createWriteStream, WriteStream } from 'fs';
import { join } from 'path';
import { IStreamOptions, StreamOptions } from './types';

/**
 * 统一写入流操作
 * @param stream 可写流
 * @param data 数据
 */
function write(stream: WriteStream, data: string): void {
  if (typeof data === 'string' && data !== '') {
    stream.write(Buffer.from(data, 'utf8'));
  }
}

class LogStream {
  /**
   * 配置参数
   */
  public options: Required<IStreamOptions>;

  /**
   * 可写流 Map
   */
  private streams: Map<string, WriteStream>;

  /**
   * 缓存 Map
   */
  private caches: Map<string, string>;

  /**
   * 是否缓存
   */
  private isCache: boolean;

  /**
   * 定时刷新
   */
  private flushTimer: NodeJS.Timer | null = null;

  /**
   * 构造函数
   * @param options 配置参数
   */
  constructor(options?: IStreamOptions) {
    this.options = Object.assign(
      {
        dir: 'logs', // 目录
        filename: '{level}.log', // 文件名
        cache: 1000, // 缓存
        mode: 0o666, // linux 文件模式
      },
      options,
    );

    this.streams = new Map();
    this.caches = new Map();
    this.isCache = this.options.cache > 0;
    this.flushTimer = null;

    this.init();
  }

  /**
   * 初始化
   */
  private init() {
    const { level, levels, dir, filename, mode } = this.options as StreamOptions;

    levels.forEach((levelName, idx) => {
      if (level > idx) {
        return;
      }

      if (this.isCache) {
        this.caches.set(levelName, '');
      }

      const name = filename.replace(/{level}/, levelName);
      const stream = createWriteStream(join(dir, name), { flags: 'a', mode });
      this.streams.set(levelName, stream);
    });

    if (this.isCache) {
      this.flushTimer = setInterval(this.flush.bind(this), this.options.cache);
      /* istanbul ignore next */
      process.on('SIGINT', () => {
        this.close();
        process.exit(0);
      });
    }
  }

  /**
   * 写到日志文件
   * @param data 日志数据
   * @param param 参数
   */
  public write(data: string, { level }: { level: string } ): void {
    if (this.streams.has(level)) {
      if (this.isCache) {
        this.caches.set(level, this.caches.get(level) + data);
      } else {
        write(this.streams.get(level) as WriteStream, data);
      }
    }
  }

  /**
   * 刷新到文件
   * @param level 类型
   */
  public flush(level?: string): void {
    if (level) {
      const data = this.caches.get(level) as string;
      if (data !== '') {
        write(this.streams.get(level) as WriteStream, data);
        this.caches.set(level, '');
      }
    } else {
      for (const [levelName, stream] of this.streams) {
        const data = this.caches.get(levelName) as string;
        if (data !== '') {
          write(stream, data);
          this.caches.set(levelName, '');
        }
      }
    }
  }

  /**
   * 关闭文件流
   */
  public close() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    for (const [level, stream] of this.streams) {
      if (this.isCache) {
        this.flush(level);
      }
      stream.close();
    }
  }
}

export default LogStream;
