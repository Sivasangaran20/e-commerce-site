const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URL || "mongodb://localhost/bags";
    await mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log(error));
    const connection = mongoose.connection;
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = connectDB;
