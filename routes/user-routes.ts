import express from "express";
import {
  createUsers,
  getAllUsers,
  getUserByUserName,
} from "../controllers/user-controller";

const router = express.Router();
router.post("/create", createUsers);
router.get("/", getAllUsers);
router.get("/:userName", getUserByUserName);
export default router;
