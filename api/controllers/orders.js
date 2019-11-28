const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

exports.orders_getAll = (req, res, next) => {
  Order.find()
    .select("quantity _id, product")
    .populate("product", "name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.orders_createOrder = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      });
      return order.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Order saved",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.order_getOrder = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product", "name")
    .exec()
    .then(order => {
      if (!order) {
        res.status(404).json({
          message: "Order not found."
        });
      }
      res.status(200).json({
        order: order
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.order_deleteOrder = (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order has been deleted",
        orderDeleted: req.params.orderId
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
