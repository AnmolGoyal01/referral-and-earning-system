import prisma from "./prismaClient.js";
import { logger, ApiError } from "../utils/index.js";

export const createEarning = async ({
    earnerId,
    sourceUserId,
    purchaseId,
    level,
    percent,
    amount,
}) => {
    try {
        logger.info(`Crediting ₹${amount} (L${level}) to user ${earnerId}`);
        return await prisma.earning.create({
            data: {
                earnerId,
                sourceUserId,
                purchaseId,
                level,
                percent,
                amount,
            },
        });
    } catch (error) {
        throw new ApiError(500, `DB error in createEarning: ${error}`);
    }
};

export const findEarningsByEarnerId = async (earnerId) => {
    try {
        logger.info(`findEarningsByEarnerId for earnerId: ${earnerId}`);
        return await prisma.earning.findMany({
            where: { earnerId },
            include: {
                purchase: true,
                sourceUser: { select: { fullName: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        throw new ApiError(500, `DB error in findEarningsByEarnerId: ${error}`);
    }
};

export const getEarningsSummaryByEarnerId = async (earnerId) => {
    try {
        logger.info(`getEarningsSummaryByEarnerId for earnerId: ${earnerId}`);
        const [l1, l2] = await Promise.all([
            prisma.earning.aggregate({
                _sum: { amount: true },
                where: { earnerId, level: 1 },
            }),
            prisma.earning.aggregate({
                _sum: { amount: true },
                where: { earnerId, level: 2 },
            }),
        ]);
        logger.info(`getEarningsSummaryByEarnerId for earnerId: ${earnerId}`);
        return {
            level1: (l1._sum.amount || 0).toFixed(2),
            level2: (l2._sum.amount || 0).toFixed(2),
            total: (
                Number(l1._sum.amount || 0) + Number(l2._sum.amount || 0)
            ).toFixed(2),
        };
    } catch (error) {
        throw new ApiError(
            500,
            `DB error in getEarningsSummaryByEarnerId: ${error}`
        );
    }
};
