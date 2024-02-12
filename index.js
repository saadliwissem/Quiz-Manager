const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const DeliveryRoutes = require("./routes/DeliveryRoutes");
//const Delivery = require("./models/Delivery");
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

app.use("/pharmacies", pharmacyRoutes);
app.use("/medicines", medicineRoutes);
app.use("/auth", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/deliveries", DeliveryRoutes);
// const insertFakeDeliveries = async () => {
//   try {
//     const fakeDeliveries = require("./fakeDeliveries.json");

//     // Insert fake deliveries into the database
//     await Delivery.insertMany(fakeDeliveries);

//     console.log("Fake deliveries inserted successfully");
//   } catch (error) {
//     console.error("Error inserting fake deliveries:", error);
//   }
// };

const port = 3117;
app.listen(port, () => {
  connect();
  console.log("listening on port: " + port);
});
