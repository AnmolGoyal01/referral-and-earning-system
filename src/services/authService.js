import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/index.js";
import * as userDb from "../db/user.db.js";
import { JWT_SECRET } from "../constants.js";
import { isValidUUID } from "../utils/utilityFunctions.js";
import { logger } from "../utils/logger.js";

export const register = async ({ fullName, email, password, parentId }) => {
    logger.info(`Register attempt for email: ${email}`);

    const existing = await userDb.findUserByEmail(email);
    if (existing) throw new ApiError(409, "Email already exists");

    if (parentId) {
        if (!isValidUUID(parentId))
            throw new ApiError(400, "Invalid referral code format");

        const parent = await userDb.findUserById(parentId);
        if (!parent) throw new ApiError(404, "Invalid referral code");

        const referralCount = await userDb.countReferralsByParentId(parentId);
        if (referralCount >= 8)
            throw new ApiError(400, "Parent has maxed out referrals");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userDb.createUser({
        fullName,
        email,
        password: hashedPassword,
        parentId,
    });

    logger.info(`User created with id: ${user.id}`);

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return { token, user };
};

export const login = async ({ email, password }) => {
    logger.info(`Login attempt for email: ${email}`);

    const user = await userDb.findUserByEmail(email);
    if (!user) throw new ApiError(404, "User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError(401, "Invalid credentials");

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    logger.info(`Login success for email: ${email}`);

    return {
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email },
    };
};

export const updateName = async (userId, fullName) => {
    logger.info(`Updating name for user ${userId}`);
    const user = await userDb.updateUser(userId, { fullName });
    logger.info(`Name updated for user ${userId}`);
    return user;
};

export const updatePassword = async (userId, oldPassword, newPassword) => {
    logger.info(`Updating password for user ${userId}`);
    const user = await userDb.findUserById(userId);
    if (!user) throw new ApiError(404, "User not found");
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new ApiError(401, "Invalid old password");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await userDb.updateUser(userId, {
        password: hashedPassword,
    });
    logger.info(`Password updated for user ${userId}`);
    return updatedUser;
};

export const getParent = async (userId) => {
    logger.info(`Getting parent for user ${userId}`);
    const user = await userDb.getUserParent(userId);
    if (!user?.parent) throw new ApiError(404, "Parent not found");
    logger.info(`Parent fetched for user ${userId}`);
    return user.parent;
};

export const getReferrals = async (userId) => {
    logger.info(`Getting referrals for user ${userId}`);
    const referrals = await userDb.getReferralsByParentId(userId);
    logger.info(`Referrals fetched for user ${userId}`);
    return referrals;
};
