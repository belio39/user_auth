"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user-controller");
const router = express_1.default.Router();
router.post("/create", user_controller_1.createUsers);
router.get("/", user_controller_1.getAllUsers);
router.get("/:userName", user_controller_1.getUserByUserName);
router.put("/:id", user_controller_1.updateUser);
router.delete("/:id", user_controller_1.deleteUser);
router.post("/login", user_controller_1.loginUser);
router.patch("/:id", user_controller_1.resetPassWord);
exports.default = router;
