import dotenv from "dotenv";
dotenv.config();
import http from "http";

import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`Server is running on https://localhost:${PORT}`);
    });
}).catch((error) => {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
}); 