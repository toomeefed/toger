"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 获取时区偏差 (负数)
const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
/**
 * 当前时间
 * @param type 返回格式控制
 */
function now(type) {
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
exports.now = now;
/**
 * 按级别返回标准 输出/错误 流 (用于日志分级，如 pm2 日志)
 * @param level 日志类别
 */
function getStdio(level) {
    if (level === 'error' || level === 'fatal') {
        return process.stderr;
    }
    return process.stdout;
}
exports.getStdio = getStdio;
/**
 * 空函数
 */
function noop() {
    // nothing todo
}
exports.noop = noop;
//# sourceMappingURL=utils.js.map