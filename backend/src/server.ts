import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb";
import connectRedis from "./config/redis";

import { createServer } from "http";
import { initSocket } from "./socket/index";

import authRoutes from "./routes/common/authRoutes";
// admin routes
import userRoutes from "./routes/admin/userRoutes";
import designerVerificationRoutes from "./routes/admin/designerVerificationRoutes";
import disputeManagementRoutes from "./routes/admin/adminDisputeRoutes";
import transactionRoutes from "./routes/admin/transactionRoutes";
// designer routes
import designerRoutes from "./routes/designer/designerRoutes";
import designRoutes from "./routes/designer/designRoutes";
import jobApplicationRoutes from "./routes/designer/jobApplicationRoutes";
// user routes
import jobRoutes from "./routes/user/jobRoutes";
import savedDesignRoutes from "./routes/user/savedDesignRoutes";
import activeJobsRoute from "./routes/user/activeJobRoutes";
// common routes
import profileRoutes from "./routes/common/profileRoutes";
import dashboardRoutes from "./routes/common/dashboardRoutes";
import recomendationRoutes from "./routes/common/recomendationRoutes";
//benchmark routes
import designBMRoutes from "./routes/benchmark/designBMRoutes";
// proposalRoutes
import disputeRoutes from "./routes/proposal/disputeRoutes";
import paymentRoutes from "./routes/proposal/paymentRoutes";
import proposalRoutes from "./routes/proposal/proposalRoutes";
import reviewRoutes from "./routes/proposal/reviewRoutes";

import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { allowedOrigins } from "./config/cors";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/payments", paymentRoutes);
app.use(express.json());

// admin

app.use("/api/admin/users", userRoutes);
app.use("/api/admin/transaction", transactionRoutes);
app.use("/api/admin/disputes", disputeManagementRoutes);
app.use("/api/admin/designer-application", designerVerificationRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/designer", designerRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/design", designRoutes);
app.use("/api/job-application", jobApplicationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/saved-design", savedDesignRoutes);

app.use("/api/design-bm", designBMRoutes);
app.use("/api/proposal", proposalRoutes);
app.use("/api/active-job", activeJobsRoute);

app.use("/api/review", reviewRoutes);
app.use("/api/dispute", disputeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recomendation", recomendationRoutes);
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    const httpServer = createServer(app);
    initSocket(httpServer);

    httpServer.listen(PORT, () => console.log("Server running at the PORT: ", PORT));
  } catch (error) {
    console.error("failed to start the server: ", error);
  }
};

startServer();
