const express = require("express");
const { getAllDeliveries, createDelivery,createDeliveryPerson} = require("../controllers/deliveryController");
const router = express.Router();


router.get("/", getAllDeliveries);
router.post("/createDeliveryPerson", createDeliveryPerson);


module.exports = router;
