import mongoose from "mongoose";
import config from "../config";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoDbUrl);
    mongoose.set('strictPopulate', false);
    console.log("MongoDB is connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Connected to db...");
});

mongoose.connection.on("error", (err) => {
  console.error(`Db connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Db connection is disconnected...");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB;
