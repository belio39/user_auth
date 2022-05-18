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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homePage = exports.resetPassWord = exports.loginUser = exports.deleteUser = exports.updateUser = exports.getUserByUserName = exports.getAllUsers = exports.createUsers = void 0;
const uuid_1 = require("uuid");
const mssql_1 = __importDefault(require("mssql"));
const user_schema_1 = require("../models/user-schema");
const user_login_1 = require("../models/user-login");
const register_schema_1 = require("../models/register-schema");
const config_1 = __importDefault(require("../config/config"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const createUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const { userName, fullName, email, age, password, role } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        let pool = yield mssql_1.default.connect(config_1.default);
        const { error } = user_schema_1.userSchema.validate(req.body);
        if (error) {
            return res.json(error.details[0].message);
        }
        else {
            yield pool
                .request()
                .input("id", mssql_1.default.VarChar, id)
                .input("userName", mssql_1.default.VarChar, userName)
                .input("fullName", mssql_1.default.VarChar, fullName)
                .input("email", mssql_1.default.VarChar, email)
                .input("age", mssql_1.default.Numeric, age)
                .input("password", mssql_1.default.VarChar, hashedPassword)
                .input("role", mssql_1.default.VarChar, role)
                .execute("createUsers");
            res.status(200).json({
                message: "User Created Successfully!",
            });
        }
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.createUsers = createUsers;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pool = yield mssql_1.default.connect(config_1.default);
        const users = yield pool.request().execute("getAllUsers");
        const data = users.recordset.map((record) => {
            const { password } = record, rest = __rest(record, ["password"]);
            return rest;
        });
        res.status(200).json({
            message: "Success",
            data,
        });
    }
    catch (error) {
        res.json({ error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
const getUserByUserName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userName = req.params.userName;
        let pool = yield mssql_1.default.connect(config_1.default);
        const user = yield pool
            .request()
            .input("userName", mssql_1.default.VarChar, userName)
            .execute("getUserByUserName");
        if (!user.recordset[0]) {
            return res.json({
                message: `No user with ${userName} Does Not exist`,
            });
        }
        res.status(200).json({
            message: "Success",
            data: user.recordset,
        });
    }
    catch (error) {
        res.json({
            error: error.message,
        });
    }
});
exports.getUserByUserName = getUserByUserName;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let pool = yield mssql_1.default.connect(config_1.default);
        const { userName, fullName, email, age, password, role } = req.body;
        // Check if email and password exist
        if (!userName) {
            return res.status(400).json({
                message: "Please provide your userName",
            });
        }
        const user = yield pool
            .request()
            .input("userName", mssql_1.default.VarChar, id)
            .execute("getUserByUserName");
        if (!user.recordset[0]) {
            return res.json({
                message: `No user with that ${id}`,
            });
        }
        yield pool
            .request()
            .input("id", mssql_1.default.VarChar, user.recordset[0].id)
            .input("userName", mssql_1.default.VarChar, userName)
            .input("fullName", mssql_1.default.VarChar, fullName)
            .input("email", mssql_1.default.VarChar, email)
            .input("age", mssql_1.default.Numeric, age)
            .input("password", mssql_1.default.VarChar, password)
            .input("role", mssql_1.default.VarChar, role)
            .execute("updateUser");
        res.status(200).json({
            message: "User Successfully Updated",
        });
    }
    catch (error) {
        res.json({
            error: error.message,
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let pool = yield mssql_1.default.connect(config_1.default);
        const user = yield pool
            .request()
            .input("id", mssql_1.default.VarChar, id)
            .execute("getUserById");
        if (!user.recordset[0]) {
            return res.json({
                message: `User with ID : ${id} Does Not exist`,
            });
        }
        yield pool.request().input("id", mssql_1.default.VarChar, id).execute("deleteUser");
        res.status(200).json({
            message: "User Successfully deleted",
            deletedBy: req.body.users.fullName,
        });
    }
    catch (error) {
        res.json({
            error: error.message,
        });
    }
});
exports.deleteUser = deleteUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pool = yield mssql_1.default.connect(config_1.default);
        const { userName, password } = req.body;
        // Check if email and password exist
        if (!userName || !password) {
            return res.status(400).json({
                message: "Please provide email and password!",
            });
        }
        const { error } = user_login_1.logInSchema.validate(req.body);
        if (error) {
            return res.json({
                error: error.details[0].message,
            });
        }
        const user = yield pool
            .request()
            .input("userName", mssql_1.default.VarChar, userName)
            .execute("getUserByUserName");
        if (!user.recordset[0]) {
            return res.json({ message: `Invalid credentials` });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.recordset[0].password);
        if (!passwordMatch) {
            return res.json({ message: `Invalid credentials` });
        }
        const _a = user.recordset[0], { password: _ } = _a, details = __rest(_a, ["password"]);
        const token = yield jsonwebtoken_1.default.sign({ id: details.id }, process.env.SECRET_KEY, { expiresIn: "24h" });
        res.json({ message: "Login Successfulll", user: details, token });
    }
    catch (error) {
        res.json({
            error: error.message,
        });
    }
});
exports.loginUser = loginUser;
const resetPassWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let pool = yield mssql_1.default.connect(config_1.default);
        const { error } = register_schema_1.RegisterSchema.validate(req.body);
        if (error) {
            return res.json(error.details[0].message);
        }
        const { password } = req.body;
        const user = yield pool
            .request()
            .input("id", mssql_1.default.VarChar, id)
            .execute("getUserById");
        if (!user.recordset[0]) {
            return res.json({
                message: `No user with that ID ${id}`,
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield pool
            .request()
            .input("id", mssql_1.default.VarChar, id)
            .input("password", mssql_1.default.VarChar, hashedPassword)
            .execute("resetPassWord");
        res.status(200).json({
            messege: "Password reset was successful",
        });
    }
    catch (error) {
        res.json({
            error: error.message,
        });
    }
});
exports.resetPassWord = resetPassWord;
const homePage = (req, res) => {
    res.json({
        Message: `Hello user ${req.body.users.fullName} Welcome..`,
    });
};
exports.homePage = homePage;
