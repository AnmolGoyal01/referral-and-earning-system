import jwt from "jsonwebtoken";
import { asyncHandler, ApiError } from "../utils/index.js";
import { JWT_SECRET } from "../constants.js";
import { findUserById } from "../db/user.db.js";
import { logger } from "../utils/logger.js";

export const verifyJWT = asyncHandler(async (req, _res, next) => {
    logger.info("authenticating user");
    const token =
        req.cookies?.token ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request");

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch {
        throw new ApiError(401, "Invalid or expired token");
    }

    const user = await findUserById(decoded.id);
    if (!user) throw new ApiError(401, "User no longer exists");

    logger.info(`user authenticated successfully user: ${user.email}`);

    req.user = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        parentId: user.parentId,
    };
    next();
});
