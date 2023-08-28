import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { notFound, errorHandler } from "./middlewares.js";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";

import userRouter from "./routes/users.js";
import postRouter from "./routes/posts.js"
import poetRouter from "./routes/poet.js";
import commentRouter from "./routes/comments.js";

import connectDatabase from "./configs/dbConfig.js";


config();

const app = express();
connectDatabase();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors("*"));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(
  "/uploads",
  express.static(path.join(path.dirname(""), "./src/uploads/"))
);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/poets',poetRouter);
app.use('/api/v1/comments',commentRouter);

app.get('/seed',async (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});
app.get('/',async (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use(notFound);
app.use(errorHandler);


export default app;
