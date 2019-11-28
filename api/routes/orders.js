const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const OrdersController = require("../controllers/orders");

router.get("/", checkAuth, OrdersController.orders_getAll);

router.post("/", checkAuth, OrdersController.orders_createOrder);

router.get("/:orderId", checkAuth, OrdersController.order_getOrder);

router.delete("/:orderId", checkAuth, OrdersController.order_deleteOrder);

module.exports = router;
