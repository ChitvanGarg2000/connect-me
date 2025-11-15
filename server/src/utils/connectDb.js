import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    return "Connected to DB";
  } catch (error) {
    throw new Error(`Failed to connect to DB: ${error}`);
  }
};
