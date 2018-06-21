"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * 统一写入流操作
 * @param stream 可写流
 * @param data 数据
 */
function write(stream, data) {
    if (typeof data === 'string' && data !== '') {
        stream.write(Buffer.from(data, 'utf8'));
    }
}
class LogStream {
    /**
     * 构造函数
     * @param options 配置参数
     */
    constructor(options) {
        /**
         * 定时刷新
         */
        this.flushTimer = null;
        this.options = Object.assign({
            dir: 'logs',
            filename: '{level}.log',
            cache: 1000,
            mode: 0o666,
        }, options);
        this.streams = new Map();
        this.caches = new Map();
        this.isCache = this.options.cache > 0;
        this.flushTimer = null;
        this.init();
    }
    /**
     * 初始化
     */
    init() {
        const { level, levels, dir, filename, mode } = this.options;
        levels.forEach((levelName, idx) => {
            if (level > idx) {
                return;
            }
            if (this.isCache) {
                this.caches.set(levelName, '');
            }
            const name = filename.replace(/{level}/, levelName);
            const stream = fs_1.createWriteStream(path_1.join(dir, name), { flags: 'a', mode });
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
    write(data, { level }) {
        if (this.streams.has(level)) {
            if (this.isCache) {
                this.caches.set(level, this.caches.get(level) + data);
            }
            else {
                write(this.streams.get(level), data);
            }
        }
    }
    /**
     * 刷新到文件
     * @param level 类型
     */
    flush(level) {
        if (level) {
            const data = this.caches.get(level);
            if (data !== '') {
                write(this.streams.get(level), data);
                this.caches.set(level, '');
            }
        }
        else {
            for (const [levelName, stream] of this.streams) {
                const data = this.caches.get(levelName);
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
    close() {
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
exports.default = LogStream;
//# sourceMappingURL=logstream.js.map