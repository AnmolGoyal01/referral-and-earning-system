import prisma from "./prismaClient.js";
import { logger } from "../utils/index.js";
import { ApiError } from "../utils/ApiError.js";

export const findUserByEmail = async (email) => {
    try {
        logger.info(`findUserByEmail for email: ${email}`);
        return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
        throw new ApiError(500, `DB error in findUserByEmail: ${error}`);
    }
};

export const findUserById = async (id) => {
    try {
        logger.info(`findUserById for id: ${id}`);
        return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
        throw new ApiError(500, `DB error in findUserById: ${error}`);
    }
};

export const countReferralsByParentId = async (parentId) => {
    try {
        logger.info(`countReferralsByParentId for parentId: ${parentId}`);
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
        logger.info(`Creating new user with email: ${email}`);
        return await prisma.user.create({
            data: { fullName, email, password, parentId: parentId ?? null },
            select: { id: true, fullName: true, email: true, parentId: true },
        });
    } catch (error) {
        throw new ApiError(500, `Failed to save user ${email} to DB: ${error}`);
    }
};

export const getUserWithAncestors = async (userId) => {
    try {
        logger.info(`getUserWithAncestors for userId: ${userId}`);
        return await prisma.user.findUnique({
            where: { id: userId },
            include: { parent: { include: { parent: true } } },
        });
    } catch (error) {
        throw new ApiError(500, `DB error in getUserWithAncestors: ${error}`);
    }
};

export const updateUser = async (userId, data) => {
    try {
        logger.info(
            `Updating user ${userId} with data: ${JSON.stringify(data)}`
        );
        return await prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, fullName: true, email: true },
        });
    } catch (error) {
        throw new ApiError(500, `DB error in updateUser: ${error}`);
    }
};

export const getUserParent = async (userId) => {
    try {
        logger.info(`Getting parent for user ${userId}`);
        return await prisma.user.findUnique({
            where: { id: userId },
            include: {
                parent: {
                    select: { id: true, fullName: true, email: true },
                },
            },
        });
    } catch (error) {
        throw new ApiError(500, `DB error in getUserParent: ${error}`);
    }
};

export const getReferralsByParentId = async (parentId) => {
    try {
        logger.info(`Getting referrals for parent ${parentId}`);
        return await prisma.user.findMany({
            where: { parentId },
            select: { id: true, fullName: true, email: true },
        });
    } catch (error) {
        throw new ApiError(500, `DB error in getReferralsByParentId: ${error}`);
    }
};
