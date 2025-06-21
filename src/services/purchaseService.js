import { MIN_PURCHASE } from "../constants.js";
import * as purchaseDb from "../db/purchase.db.js";
import { getUserWithAncestors } from "../db/user.db.js";
import { creditEarnings } from "./earningsService.js";
import { ApiError, logger } from "../utils/index.js";

export const recordPurchase = async ({ buyerId, amount }) => {
logger.info(`Recording purchase of ₹${amount} by user ${buyerId}`);

    const purchase = await purchaseDb.createPurchase({ buyerId, amount });
    logger.info(`Purchase created with id: ${purchase.id}`);

    logger.info(
        `Checking if purchase amount is greater than minimum purchase amount (${MIN_PURCHASE})`
    );
    if (amount >= MIN_PURCHASE) {
        logger.info(
            `Loading buyer with parent & grandparent with buyerId: ${buyerId}`
        );
        const buyer = await getUserWithAncestors(buyerId);
        logger.info(
            `Buyer loaded with parent & grandparent with buyerId: ${buyerId}`
        );
        logger.info(`Crediting earnings for purchase ${purchase.id}`);
        await creditEarnings({ buyer, purchase });
    }

    return purchase;
};

export const getUserPurchases = async (userId) => {
    logger.info(`Getting purchases for user ${userId}`);
    const purchases = await purchaseDb.findPurchasesByUserId(userId);
    logger.info(
        `Purchases fetched for user ${userId}, purchases : ${JSON.stringify(
            purchases
        )}`
    );
    return purchases;
};
