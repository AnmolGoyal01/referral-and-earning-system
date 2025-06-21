import express from "express";
import {
    createPurchase,
    getMyEarnings,
    getMyPurchases,
    getEarningsSummary,
} from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/purchase", createPurchase);
router.get("/earnings", getMyEarnings);
router.get("/purchases", getMyPurchases);
router.get("/earnings/summary", getEarningsSummary);

export default router;
