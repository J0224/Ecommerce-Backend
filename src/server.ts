import express, { Request, Response } from "express";
import mongoose from "mongoose";
const dotenv = require ("dotenv").config();
import router from "./routes/productRoutes";
import routerCart from "./routes/cartRoutes"
import routerUser from "./routes/userRoutes";
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require("./midleware/errorMidleware");
const cors = require ("cors");

if (!dotenv) {
  console.error("Error loading .env file:", dotenv);
}

const app = express();

// Express middleware for parsing JSON
app.use(express.json());
// Use the cookie-parser middleware
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json()); // Make sure this comes before route handlers.


// Define routes
app.use("/api/products", router);
app.use("/api/cart", routerCart);
app.use("/api/user", routerUser);

// Define a basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.send("Home Page");
});

const PORT: string | number = process.env.PORT || 8000;
const uri: string | undefined = process.env.MONGO_URI;

if (!uri) {
  console.log("Missing required ENV file");
  throw new Error("Missing required ENV file");
}

// Connect to the database
mongoose
  .connect(uri, )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));



 