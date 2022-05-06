import express from "express";
import {
  createUsers,
  getAllUsers,
  getUserByUserName,
  updateUser,
} from "../controllers/user-controller";

const router = express.Router();
router.post("/create", createUsers);
router.get("/", getAllUsers);
router.get("/:userName", getUserByUserName);
router.put("/:id", updateUser);
export default router;
