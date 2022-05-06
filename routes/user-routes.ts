import express from "express";
import { createUsers } from "../controllers/user-controller";

const router = express.Router();
router.post("/create", createUsers);
export default router;
