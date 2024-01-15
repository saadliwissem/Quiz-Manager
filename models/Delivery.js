const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
  items: [{ type: String, required: true }], // Array of items being delivered
  deliveryPerson: {
    type: Schema.Types.ObjectId,
    ref: "DeliveryPerson",
    required: true,
  }, // Reference to DeliveryPerson model
  fromPharmacy: {
    type: Schema.Types.ObjectId,
    ref: "Pharmacy",
    required: true,
  }, // Reference to Pharmacy model
  requestedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to User model for the requester
  date: { type: Date, default: Date.now }, // Date of the delivery
  deliveryAddress: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "delivered", "cancelled"],
    default: "pending",
  },
  deliveryCost: { type: Number, required: true },
});

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
