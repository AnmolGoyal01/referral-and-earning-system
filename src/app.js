import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
    errorHandler,
    notFound,
    requestLogger,
    errorLogger,
} from "./middlewares/index.js";
import path from "path";

const app = express();

// config cors,json,cookieParser,etc
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// request logger
app.use(requestLogger);

// health check route
app.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" });
});

// routes import
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

// routes declaration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/transaction", transactionRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// error middlewares
app.use(errorLogger);
app.use(notFound);
app.use(errorHandler);

export default app;
