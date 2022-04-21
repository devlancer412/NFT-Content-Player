require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL + process.env.DB_NAME, () => {
  console.log(
    `MongoDB connected: ${process.env.MONGO_URL + process.env.DB_NAME}`
  );
});
