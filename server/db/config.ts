import mongoose from "mongoose";
import "dotenv/config";

const mongoUri = process.env.MONGODB_URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri || "");
    console.log("Connected to mongodb");
  } catch (error) {
    console.error("Error connecting with mongodb", error);
  }
};
