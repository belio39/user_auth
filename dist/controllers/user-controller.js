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
exports.deleteUser = exports.updateUser = exports.getUserByUserName = exports.getAllUsers = exports.createUsers = void 0;
const uuid_1 = require("uuid");
const mssql_1 = __importDefault(require("mssql"));
const user_schema_1 = require("../models/user-schema");
const config_1 = __importDefault(require("../config/config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// interface RequestExtended extends Request {
//   user?: any;
// }
const createUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
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
            .input("role", mssql_1.default.VarChar, role)
            .execute("createUsers");
        res.status(200).json({
            message: "User Created Successfully!",
        });
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
        res.status(200).json({
            message: "Success",
            data: users.recordset,
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
                message: `User with userName : ${id} Does Not exist`,
            });
        }
        yield pool.request().input("id", mssql_1.default.VarChar, id).execute("deleteUser");
        res.status(200).json({
            message: "User Successfully deleted",
        });
    }
    catch (error) {
        res.json({
            error: error.message,
        });
    }
});
exports.deleteUser = deleteUser;
// export const loginUser: RequestHandler = async (req, res) => {
//   try {
//     let pool = await mssql.connect(sqlConfig);
//     const { email, password } = req.body as { email: string; password: string };
//     const user = await pool.request().query(
//       `
//       `
//     );
//   } catch (error: any) {
//     res.json({
//       error: error.message,
//     });
//   }
// };
