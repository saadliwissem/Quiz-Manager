const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const quizController = require("./controllers/quizController")
const app = express();

const bodyParser = require("body-parser");

//cors
const cors = require("cors");
app.use(cors());
// Middleware
app.use(bodyParser.json());
//mongoose connection
dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    //await insertFakeDeliveries();
    console.log("connected to mdb");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("db disconnected ");
});

mongoose.connection.on("connected", () => {
  console.log("db connected ");
});

app.use("/auth", userRoutes);
app.use( quizController);

const port = 3117;
app.listen(port, () => {
  connect();
  console.log("listening on port: " + port);
});
