import * as earningDb from "../db/earning.db.js";
import { L1_RATE, L2_RATE } from "../constants.js";
import { logger } from "../utils/index.js";
import { getIO } from "../socket/index.js";

export const creditEarnings = async ({ buyer, purchase }) => {
    logger.info(`Crediting earnings for purchase ${purchase.id}`);
    logger.info(`checking if parent exists for buyer ${buyer.id}`);
    const { parent } = buyer;
    if (!parent) return;

    const l1Amount = purchase.amount * L1_RATE;
    logger.info(
        `Crediting L1 earnings for user ${parent.id} for amount ${l1Amount}`
    );
    await earningDb.createEarning({
        earnerId: parent.id,
        sourceUserId: buyer.id,
        purchaseId: purchase.id,
        level: 1,
        percent: L1_RATE * 100,
        amount: l1Amount,
    });
    logger.info(`L1 earnings credited for purchase ${purchase.id}`);
    try {
        logger.info(`Emitting socket for user ${parent.id}`);
        getIO().to(`user_${parent.id}`).emit("new-earning", {
            level: 1,
            amount: l1Amount,
            purchaseId: purchase.id,
        });
    } catch {
        logger.error(`Error emitting socket for user ${parent.id}`);
    }

    logger.info(`Checking if grandparent exists for buyer ${buyer.id}`);
    if (parent.parentId) {
        const grandParent = parent.parent;
        if (grandParent) {
            const l2Amount = purchase.amount * L2_RATE;
            logger.info(
                `Crediting L2 earnings for user ${grandParent.id} for amount ${l2Amount}`
            );
            await earningDb.createEarning({
                earnerId: grandParent.id,
                sourceUserId: buyer.id,
                purchaseId: purchase.id,
                level: 2,
                percent: L2_RATE * 100,
                amount: l2Amount,
            });
            logger.info(`L2 earnings credited for purchase ${purchase.id}`);
            try {
                logger.info(`Emitting socket for user ${grandParent.id}`);
                getIO().to(`user_${grandParent.id}`).emit("new-earning", {
                    level: 2,
                    amount: l2Amount,
                    purchaseId: purchase.id,
                });
            } catch {
                logger.error(
                    `Error emitting socket for user ${grandParent.id}`
                );
            }
        }
    }

    logger.info(`Earnings distributed for purchase ${purchase.id}`);
};

export const getUserEarnings = async (userId) => {
    logger.info(`Getting earnings for user ${userId}`);
    const earnings = await earningDb.findEarningsByEarnerId(userId);
    logger.info(`Earnings fetched for user ${userId}`);
    return earnings;
};

export const getUserEarningsSummary = async (userId) => {
    logger.info(`Getting earnings summary for user ${userId}`);
    const summary = await earningDb.getEarningsSummaryByEarnerId(userId);
    logger.info(`Earnings summary fetched for user ${userId}`);
    return summary;
};
