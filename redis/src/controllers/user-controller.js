import { Redis } from "ioredis";
import { errorResponse, successResponse } from "../configs/response";
import { User } from "../models/user-model";

const redis = new Redis();

export const createUser = async (req, res) => {
  try {
    const { name, age, department, year } = req.body;
    const newUser = new User({
      name,
      age,
      department,
      year,
    });
    await newUser.save();
    redis.del("getUsers").then(async () => {
      console.log("Cache deleted");
    });
    return successResponse(res, 201, "User Created", { newUser });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    redis.get("getUsers").then(async (result) => {
      if (result) {
        const listUsers = JSON.parse(result);
        return successResponse(res, 200, "Listing all users from redis", {
          listUsers,
        });
      } else {
        const listUsers = await User.find();
        redis.set("getUsers", JSON.stringify(listUsers));
        return successResponse(res, 200, "Listing all users from db", {
          listUsers,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {});
  }
};
