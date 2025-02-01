import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI);
    console.log(`mongo db connected: ${conn.connection.host}`);
  } catch (error) {
    throw error;
  }
};

export default connectDB;
