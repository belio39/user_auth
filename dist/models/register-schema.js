"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.RegisterSchema = joi_1.default.object({
    password: joi_1.default.string()
        .min(3)
        .max(13)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
