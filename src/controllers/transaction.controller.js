import { recordPurchase } from "../services/purchaseService.js";
import {
    getUserEarnings,
    getUserEarningsSummary,
} from "../services/earningsService.js";
import { getUserPurchases } from "../services/purchaseService.js";
import { asyncHandler, ApiResponse, ApiError, logger } from "../utils/index.js";

export const createPurchase = asyncHandler(async (req, res) => {
    logger.info(`inside createPurchase controller`);
    const { amount } = req.body;
    if (!amount) throw new ApiError(400, "Amount is required");

    const purchase = await recordPurchase({
        buyerId: req.user.id,
        amount: Number(amount),
    });
    logger.info(`Purchase recorded with id: ${purchase.id}`);
    res.status(201).json(new ApiResponse(201, purchase, "Purchase recorded"));
});

export const getMyEarnings = asyncHandler(async (req, res) => {
    logger.info(`inside getMyEarnings controller`);
    const earnings = await getUserEarnings(req.user.id);
    res.status(200).json(new ApiResponse(200, earnings, "Earnings fetched"));
});

export const getEarningsSummary = asyncHandler(async (req, res) => {
    logger.info(`inside getEarningsSummary controller`);
    const summary = await getUserEarningsSummary(req.user.id);
    res.status(200).json(new ApiResponse(200, summary, "Earnings summary"));
});

export const getMyPurchases = asyncHandler(async (req, res) => {
    logger.info(`inside getMyPurchases controller`);
    const purchases = await getUserPurchases(req.user.id);
    res.status(200).json(new ApiResponse(200, purchases, "Purchases fetched"));
});
