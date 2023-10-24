import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import errorhandler from "errorhandler";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import * as DB from "./db/connect";
import userRoute from "./routes/user";
import passwordRoute from "./routes/password";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(helmet());
app.use(mongoSanitize());
app.use(errorhandler());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/password", passwordRoute);

(async () => {
  try {
    const connectionString = process.env.CONNECTION_STRING || undefined;
    await DB.connectDB(connectionString);
    console.log("Connected to the database");

    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    process.on("SIGINT", () => {
      console.log("Shutting down...");
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
})();
