import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on https://localhost:${PORT}`);
    });
}).catch((error) => {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
}); 