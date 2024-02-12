const express = require("express");
const {
  getAllDeliveries,
  createDeliveryPerson,
  getAllDeliveryPeople,
} = require("../controllers/deliveryController");
const router = express.Router();

router.get("/", getAllDeliveries);
router.get("/deliveryPeople", getAllDeliveryPeople);
router.post("/createDeliveryPerson", createDeliveryPerson);

module.exports = router;
