const express = require("express");
const { getAllDeliveries, createDelivery,createDeliveryPerson,getAllDeliveryPeople} = require("../controllers/deliveryController");
const router = express.Router();


router.get("/", getAllDeliveries);
router.get("/deliveryPeople", getAllDeliveryPeople);
router.post("/createDeliveryPerson", createDeliveryPerson);


module.exports = router;
