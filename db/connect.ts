import mongoose, { ConnectOptions } from "mongoose";

async function connectDB(url: any): Promise<void> {
  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to the MongoDB database.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

export { connectDB };
