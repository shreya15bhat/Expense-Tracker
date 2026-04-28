const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/expense_tracker";
    
    // Attempt standard connection with a short timeout
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`Could not connect to local MongoDB. Starting an in-memory database instead...`);
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`In-memory MongoDB Connected: ${mongoUri}`);
    } catch (memError) {
      console.error(`Error starting in-memory DB: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
