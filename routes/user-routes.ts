import express from "express";
import { createUsers, getAllUsers } from "../controllers/user-controller";

const router = express.Router();
router.post("/create", createUsers);
router.get("/", getAllUsers);
export default router;
