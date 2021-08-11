const mongoose = require("mongoose");

const mongoDbConnect = async () => {
  try {
    const connectionStr = `mongodb+srv://`;
    console.log(connectionStr);
    await mongoose.connect(connectionStr, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = mongoDbConnect;