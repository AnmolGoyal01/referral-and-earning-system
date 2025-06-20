import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/index.js";
import {
    findUserByEmail,
    createUser,
    countReferralsByParentId,
    findUserById,
} from "../db/user.db.js";
import { JWT_SECRET } from "../constants.js";
import { isValidUUID } from "../utils/utilityFunctions.js";
import { logger } from "../utils/logger.js";

export const register = async ({ fullName, email, password, parentId }) => {
    logger.info(`Register attempt for ${email}`);

    const existing = await findUserByEmail(email);
    if (existing) throw new ApiError(409, "Email already exists");

    if (parentId) {
        if (!isValidUUID(parentId))
            throw new ApiError(400, "Invalid referral code format");

        const parent = await findUserById(parentId);
        if (!parent) throw new ApiError(404, "Invalid referral code");

        const referralCount = await countReferralsByParentId(parentId);
        if (referralCount >= 8)
            throw new ApiError(400, "Parent has maxed out referrals");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
        fullName,
        email,
        password: hashedPassword,
        parentId,
    });

    logger.info(`User created: ${user.id}`);

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return { token, user };
};

export const login = async ({ email, password }) => {
    logger.info(`Login attempt for ${email}`);

    const user = await findUserByEmail(email);
    if (!user) throw new ApiError(404, "User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError(401, "Invalid credentials");

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    logger.info(`Login success for ${email}`);

    return {
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email },
    };
};
