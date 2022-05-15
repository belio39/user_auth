import express from "express";
import {
  createUsers,
  getAllUsers,
  getUserByUserName,
  updateUser,
  deleteUser,
} from "../controllers/user-controller";

const router = express.Router();
router.post("/create", createUsers);
router.get("/", getAllUsers);
router.get("/:userName", getUserByUserName);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
// router.post("/logIn", loginUser);
export default router;
