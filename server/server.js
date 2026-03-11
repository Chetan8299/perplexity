import app from "./src/app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on https://localhost:${PORT}`);
    });
}).catch((error) => {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
}); 