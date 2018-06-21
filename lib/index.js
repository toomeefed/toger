"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
function logger(options) {
    return new logger_1.default(options);
}
exports.logger = logger;
exports.default = logger;
//# sourceMappingURL=index.js.map