"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.logInSchema = joi_1.default.object({
    userName: joi_1.default.string().alphanum().min(3).max(20).required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
