import prisma from "./prismaClient.js";
import { logger } from "../utils/index.js";
import { ApiError } from "../utils/ApiError.js";

export const findUserByEmail = async (email) => {
    try {
        logger.info(`findUserByEmail: ${email}`);
        return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
        throw new ApiError(500, `DB error in findUserByEmail: ${error}`);
    }
};

export const findUserById = async (id) => {
    try {
        logger.info(`findUserById: ${id}`);
        return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
        throw new ApiError(500, `DB error in findUserById: ${error}`);
    }
};

export const countReferralsByParentId = async (parentId) => {
    try {
        logger.info(`countReferralsByParentId for parent ${parentId}`);
        return await prisma.user.count({ where: { parentId } });
    } catch (error) {
        throw new ApiError(
            500,
            `DB error in countReferralsByParentId: ${error}`
        );
    }
};

export const createUser = async ({ fullName, email, password, parentId }) => {
    try {
        logger.info(`Creating new user: ${email}`);
        return await prisma.user.create({
            data: { fullName, email, password, parentId: parentId ?? null },
            select: { id: true, fullName: true, email: true, parentId: true },
        });
    } catch (error) {
        throw new ApiError(500, `Failed to save user ${email} to DB: ${error}`);
    }
};
