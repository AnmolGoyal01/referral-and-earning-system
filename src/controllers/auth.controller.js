import {
    asyncHandler,
    ApiError,
    ApiResponse,
    validateEmail,
    logger,
} from "../utils/index.js";
import * as authService from "../services/authService.js";

const register = asyncHandler(async (req, res) => {
    logger.info("inside register controller");
    const { fullName, email, password, referralCode } = req.body;
    if (!email || !password || !fullName)
        throw new ApiError(400, "email, password and fullName are required");

    if (!validateEmail(email)) throw new ApiError(400, "Invalid email");

    const result = await authService.register({
        fullName,
        email,
        password,
        parentId: referralCode,
    });
    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    res.cookie("token", result.token, cookieOptions)
        .status(201)
        .json(new ApiResponse(201, result, "User registered"));
});

const login = asyncHandler(async (req, res) => {
    logger.info("inside login controller");
    const { email, password } = req.body;
    if (!email || !password)
        throw new ApiError(400, "email and password are required");

    if (!validateEmail(email)) throw new ApiError(400, "Invalid email");

    const result = await authService.login({ email, password });

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };
    res.cookie("token", result.token, cookieOptions)
        .status(200)
        .json(new ApiResponse(200, result, "Login successful"));
});

const getProfile = asyncHandler(async (req, res) => {
    logger.info("inside get profile controller");
    const user = req.user;
    res.status(200).json(new ApiResponse(200, user, "Profile fetched"));
});

const logout = asyncHandler(async (req, res) => {
    logger.info("inside logout controller");
    res.clearCookie("token")
        .status(200)
        .json(new ApiResponse(200, null, "Logout successful"));
});

export { register, login, getProfile, logout };
