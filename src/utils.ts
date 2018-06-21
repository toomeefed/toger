// 获取时区偏差 (负数)
const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

/**
 * 当前时间
 * @param type 返回格式控制
 */
export function now(type?: string): string | number {
  const n = Date.now();

  if (type === undefined) {
    return n;
  }

  // yyyy-MM-dd
  if (type === 'date') {
    return new Date(n - timezoneOffset).toISOString().slice(0, 10);
  }

  // yyyy-MM-dd hh:mm:ss
  return new Date(n - timezoneOffset)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
}

/**
 * 按级别返回标准 输出/错误 流 (用于日志分级，如 pm2 日志)
 * @param level 日志类别
 */
export function getStdio(level: string): NodeJS.WriteStream {
  if (level === 'error' || level === 'fatal') {
    return process.stderr;
  }
  return process.stdout;
}

/**
 * 空函数
 */
export function noop() {
  // nothing todo
}
