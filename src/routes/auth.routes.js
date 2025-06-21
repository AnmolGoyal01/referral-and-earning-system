import express from "express";
import {
    register,
    login,
    getProfile,
    logout,
    updateName,
    updatePassword,
    getParent,
    getReferrals,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyJWT, getProfile);
router.post("/logout", verifyJWT, logout);
router.patch("/update-name", verifyJWT, updateName);
router.patch("/update-password", verifyJWT, updatePassword);
router.get("/parent", verifyJWT, getParent);
router.get("/referrals", verifyJWT, getReferrals);

export default router;
