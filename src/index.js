import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/prismaClient.js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 4000;

connectDB().then(() =>
    app.listen(PORT, () => {
        console.log(`App is listening on http://localhost:${PORT}`);
    })
);
