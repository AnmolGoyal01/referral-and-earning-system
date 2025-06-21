process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import { connectDB } from "./db/prismaClient.js";
import { initSocketServer } from "./socket/index.js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 4000;

const httpServer = http.createServer(app);
initSocketServer(httpServer);

connectDB().then(() =>
    httpServer.listen(PORT, () =>
        console.log(`HTTP & Socket.IO on http://localhost:${PORT}`)
    )
);
