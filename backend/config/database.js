require("dotenv").config();

const mongoose = require("mongoose");
(async () => {
  await mongoose.connect(process.env.MONGO_URL + process.env.DB_NAME);

  console.log(
    `MongoDB connected: ${process.env.MONGO_URL + process.env.DB_NAME}`
  );
})();
