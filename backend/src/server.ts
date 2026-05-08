import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectRedis from "./config/redis.js";

import authRoutes from "./routes/common/authRoutes.js"
// admin routes
import userRoutes from "./routes/admin/userRoutes.js"
import designerVerificationRoutes from "./routes/admin/designerVerificationRoutes.js"
// designer routes
import designerRoutes from "./routes/designer/designerRoutes.js"
import designRoutes from "./routes/designer/designRoutes.js"
import jobApplicationRoutes from "./routes/designer/jobApplicationRoutes.js"
// user routes
import jobRoutes from "./routes/user/jobRoutes.js"
import savedDesignRoutes from "./routes/user/savedDesignRoutes.js"

// common routes
import profileRoutes from "./routes/common/profileRoutes.js"

import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
// import passport from "passport";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());

// admin
app.use("/api/admin/users", userRoutes)
app.use("/api/admin/designer-application", designerVerificationRoutes)


app.use("/api/auth", authRoutes)
app.use("/api/designer", designerRoutes)
app.use("/api/job", jobRoutes)
app.use("/api/design", designRoutes)
app.use("/api/job-application", jobApplicationRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/saved-designs", savedDesignRoutes)
app.use(globalErrorHandler)




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