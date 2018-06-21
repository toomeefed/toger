"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
function toger(options) {
    return new logger_1.default(options);
}
exports.toger = toger;
exports.default = toger;
//# sourceMappingURL=index.js.map