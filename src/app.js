import express from "express";
import cors from "cors";
import { apiError } from "./middlewares/apiError.js";
import cookieParser from "cookie-parser";

// Importing Routes
import userRouter from "./routes/user.route.js";

const app = express();


// Using CORS
if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: ["https://kena-kata-client.vercel.app/", "*"],
      credentials: true,
    })
  );
} else {
  app.use(cors({ origin: ["http://localhost:3000", "*"], credentials: true }));
}

// Using Express Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
app.use("/api/user", userRouter);

// Error Handling
app.use(apiError);

export default app;
