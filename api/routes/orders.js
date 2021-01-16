const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../models/orders");

const orderController = require("../controllers/orders");

router.get("/", orderController.orders_get_all);

router.post("/", orderController.orders_create_order);

router.delete("/:orderId", orderController.orders_delete_order);

module.exports = router;
