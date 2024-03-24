const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connection = async () => {
  try {
    if (!process.env.MONGO_DB) {
      console.error("MongoDb Connection Uri is Not Provided");
      process.exit(1);
    }
    const conn = await mongoose.connect(process.env.MONGO_DB);
    console.log(`mongDb Connected:${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Not connected ${error}`.red);
    process.exit(1);
  }
};
module.exports = connection;
