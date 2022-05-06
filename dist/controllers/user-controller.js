"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsers = void 0;
const uuid_1 = require("uuid");
const mssql_1 = __importDefault(require("mssql"));
const user_schema_1 = require("../models/user-schema");
const config_1 = __importDefault(require("../config/config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = uuid_1.v1;
        const { userName, fullName, email, age, password, role } = req.body;
        let pool = yield mssql_1.default.connect(config_1.default);
        const { error } = user_schema_1.userSchema.validate(req.body);
        if (error) {
            return res.json({ error: error.details[0].message });
        }
        yield pool
            .request()
            .input("id", mssql_1.default.VarChar, id)
            .input("userName", mssql_1.default.VarChar, userName)
            .input("fullName", mssql_1.default.VarChar, fullName)
            .input("email", mssql_1.default.VarChar, email)
            .input("age", mssql_1.default.Numeric, age)
            .input("password", mssql_1.default.VarChar, password)
            .input("role", mssql_1.default.VarChar, role);
        res.status(200).json({
            message: "User Created Successfully!",
        });
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.createUsers = createUsers;