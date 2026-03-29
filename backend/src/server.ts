import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js"
import connectRedis from "./config/redis.js";
import adminRoutes from "./routes/adminRoutes.js"
import designerRoutes from "./routes/designerRoutes.js"
import customerRoutes from "./routes/customerRoutes.js"
import designRoutes from "./routes/designRoutes.js"
// import passport from "passport";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/designer", designerRoutes)
app.use("/api/customer", customerRoutes)
app.use("/api/design", designRoutes)





const startServer = async () => {
    try {
        await connectDB();
        await connectRedis()

        app.listen(PORT, () => console.log("Server running at the PORT: ", PORT))
    } catch (error) {
        console.error("failed to start the server: ", error)
    }
}

startServer()