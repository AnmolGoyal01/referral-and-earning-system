import { Server } from "socket.io";

let io;

export const initSocketServer = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: process.env.CORS_ORIGIN || "*" },
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) socket.join(`user_${userId}`);

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });

    console.log("Socket.IO initialized");
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};
