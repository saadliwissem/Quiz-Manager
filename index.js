const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const bodyParser = require("body-parser");

//cors
const cors = require("cors");
const { getLanguageData } = require("./controllers/languageController");
app.use(cors());
// Middleware
app.use(bodyParser.json());
//mongoose connection
dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
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

app.use("/pharmacies", pharmacyRoutes);
app.use("/medicines", medicineRoutes);
app.use("/language", getLanguageData);
app.use("/auth", userRoutes);

const port = 3117;
app.listen(port, () => {
  connect();
  console.log("listening on port: " + port);
});
