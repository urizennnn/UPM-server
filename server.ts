import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import errorhander from "errorhandler";
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
const PORT: number = 8080;

// Middleware setup
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
app.use(errorhander());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/pass", passwordRoute);

app.use("/", (req: Request, res: Response) => {
  res.status(200).json("Hello");
});

(async () => {
  try {
    const connectionString = process.env.CONNECTION_STRING || undefined;
    await DB.connectDB(connectionString);
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
})();
