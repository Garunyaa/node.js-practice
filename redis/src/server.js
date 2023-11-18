import express from "express";
import { connectDB } from "./configs/db";
import Redis from "ioredis";
import userRoutes from "./routes/user-routes";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { User } from "./models/user-model";

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

const port = process.env.PORT;

let client;

const init = async () => {
  client = await Redis.createClient(6379);
  client.on("connect", () => {
    console.log("Connected to Redis");
  });

  client.on("error", (error) => {
    console.error(error);
  });
};

init();

app.use("/users", userRoutes);

const createFakeData = async () => {
  for (let i = 0; i < 1000; i++) {
    const newUser = new User({
      name: faker.internet.userName(),
      age: faker.number.int(),
      department: faker.internet.userName(),
      year: faker.number.int(),
    });
    // await newUser.save();
  }
};
createFakeData();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
