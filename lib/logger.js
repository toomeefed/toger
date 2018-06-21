"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const util_1 = require("util");
const logstream_1 = __importDefault(require("./logstream"));
const utils_1 = require("./utils");
class Logger {
    /**
     * 构造函数
     * @param options 配置参数
     */
    constructor(options) {
        this.options = Object.assign({
            level: 'all',
            levels: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
            json: false,
            stamp: false,
            stream: null,
        }, options);
        this.stream = null;
        this.level = -1;
        this.init();
    }
    /**
     * 初始化函数
     */
    init() {
        const { level, levels, stream } = this.options;
        if (level === 'all') {
            this.level = -1;
        }
        else if (level === 'off') {
            this.level = Infinity;
        }
        else {
            this.level = levels.indexOf(level);
        }
        if (stream) {
            const opts = Object.assign({}, this.options, stream, { level: this.level });
            this.stream = new logstream_1.default(opts);
        }
        else {
            this.stream = utils_1.getStdio(level);
        }
        const self = this;
        levels.forEach((levelName) => {
            self[levelName] = this.printType(levelName);
        });
    }
    printType(level) {
        const LEVEL = level.toUpperCase();
        if (this.level > this.options.levels.indexOf(level)) {
            return utils_1.noop;
        }
        const { stream } = this;
        // 时间格式控制
        const time = () => (this.options.stamp ? utils_1.now() : utils_1.now('datetime'));
        // 日志输出格式控制
        const makeData = this.options.json
            ? (message, data) => JSON.stringify(Object.assign({ time: time(), level: LEVEL, message }, data)) + os_1.EOL
            : (message, data) => `[${time()}] ${LEVEL} ${message}${data ? ` - ${JSON.stringify(data)}` : ''}${os_1.EOL}`;
        return (data, ...args) => {
            let message;
            if (typeof data === 'object' && data !== null) {
                message = makeData(util_1.format.call(null, ...args), data);
            }
            else {
                message = makeData(util_1.format.call(null, data, ...args));
            }
            stream.write(message, { level });
        };
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map