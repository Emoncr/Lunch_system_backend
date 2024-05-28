import express from "express";
import { signUp, singIn } from "../controller/user.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", singIn);



export default router;
