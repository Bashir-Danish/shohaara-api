import express from "express";
import morgan from "morgan";
// import helmet from "helmet";
import helmet from 'helmet/index.cjs';
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { notFound, errorHandler } from "./middlewares.js";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import User from "./models/user.js";

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
function generateUniqueFilename() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 100);

  return `image_${timestamp}_${random}`;
}
app.put('/api/v1/:id/upload', async (req, res) => {
  const { id } = req.params; 
  const { fileType } = req.body;

  if (!req.files || !fileType) {
    return res.status(400).json({ error: "Please provide a file and fileType (user or post)" });
  }

  const file = req.files.file;
  const uniqueFilename = generateUniqueFilename();
  const ext = file.name.split(".").filter(Boolean).slice(1).join(".");

  let folder = '';
  let imagePath;

  if (fileType === 'user') {
    folder = 'users';

    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.profilePicture) {
        const oldImagePath = user.profilePicture.replace('/uploads/', '');
        const oldFilePath = path.resolve(
          path.dirname("") + `/src/uploads/${oldImagePath}`
        );
      
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (error) {
            console.error(`Error deleting file: ${error}`);
          }
        }
      }
      
      imagePath = `/uploads/${folder}/${uniqueFilename}.${ext}`;
      user.profilePicture = imagePath;
      await user.save();

      const filePath = path.resolve(
        path.dirname("") + `/src/uploads/${folder}/${uniqueFilename}` + "." + ext
      );
      file.mv(filePath, (err) => {
        if (err) return res.status(500).json({ mverror: err.message });
        res.status(200).json(user);
      });
    } catch (error) {
      res.status(500).json({ catcherror: error });
    }
  } else if (fileType === 'post') {
    folder = 'posts';
    imagePath = `/uploads/${folder}/${uniqueFilename}.${ext}`;
    const filePath = path.resolve(
      path.dirname("") + `/src/uploads/${folder}/${uniqueFilename}` + "." + ext
    );

    file.mv(filePath, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      imagePath = `/uploads/${folder}/${uniqueFilename}.${ext}`;
      res.status(200).json({ message: "File uploaded successfully", imagePath });
    });
  } else {
    return res.status(400).json({ error: "Invalid 'fileType' value" });
  }
});

app.use(notFound);
app.use(errorHandler);


export default app;
