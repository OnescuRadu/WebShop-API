const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongooes = require("mongoose");

//Importing routes
const productRoutes = require("./api/routes/products.js");
const orderRoutes = require("./api/routes/orders.js");
const userRoutes = require("./api/routes/user");

//mongoDB connection
mongooes.connect(
  `mongodb+srv://<USER>:${process.env.MONGO_ATLAS_PW}@<DATABASE>`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
);

//Morgan for logging
app.use(morgan("dev"));
//Route for static folder 'uploads' and its resources
app.use("/uploads", express.static("uploads"));
//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Application Routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

//If it passes all the routes it will create an error message of 404 and pass it to the next route
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

//Error route
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
