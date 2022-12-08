import express, { Express, Request, Response } from "express";
import postRoutes from "./routes/posts";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app: Express = express();

app.use(
  cors({
    credentials: true,
    exposedHeaders: ["SET-COOKIE"],
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/test", (req: Request, res: Response) => {
  res.json("It works!");
});

app.listen(process.env.PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${process.env.PORT}`
  );
});
