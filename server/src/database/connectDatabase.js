import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Server is connected to database.");
  } catch (error) {
    console.log("❌ Error while connecting to database:", error.message);
  };
};

export default connectDatabase;