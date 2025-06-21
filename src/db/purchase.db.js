import prisma from "./prismaClient.js";
import { logger, ApiError } from "../utils/index.js";

export const createPurchase = async ({ buyerId, amount }) => {
    try {
        logger.info(`Creating purchase of ₹${amount} by user ${buyerId}`);
        return await prisma.purchase.create({
            data: { buyerId, amount },
            select: { id: true, amount: true, buyerId: true, createdAt: true },
        });
    } catch (error) {
        throw new ApiError(500, `DB error in createPurchase: ${error}`);
    }
};

export const findPurchasesByUserId = async (userId) => {
    try {
        logger.info(`findPurchasesByUserId for user ${userId}`);
        const purchases = await prisma.purchase.findMany({
            where: { buyerId: userId },
            orderBy: { createdAt: "desc" },
        });
        return purchases;
    } catch (error) {
        throw new ApiError(500, `DB error in findPurchasesByUserId: ${error}`);
    }
};

export const findPurchaseById = async (id) => {
    try {
        logger.info(`findPurchaseById for purchase ${id}`);
        return await prisma.purchase.findUnique({ where: { id } });
    } catch (error) {
        throw new ApiError(500, `DB error in findPurchaseById: ${error}`);
    }
};
