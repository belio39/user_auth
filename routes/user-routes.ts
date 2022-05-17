import express from "express";
import { VerifyToken } from "../middleware/verify";
import {
  createUsers,
  getAllUsers,
  getUserByUserName,
  updateUser,
  deleteUser,
  loginUser,
  resetPassWord,
  homePage,
} from "../controllers/user-controller";

const router = express.Router();
router.get("/home", VerifyToken, homePage);
router.post("/create", createUsers);
router.get("/", getAllUsers);
router.get("/:userName", getUserByUserName);
router.put("/:id", updateUser);
router.delete("/:id", VerifyToken, deleteUser);
router.post("/login", loginUser);
router.patch("/:id", resetPassWord);

export default router;
