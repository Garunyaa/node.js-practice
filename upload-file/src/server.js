import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import fileRoute from "./controllers/file-upload";

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB();

app.use("/api", fileRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
