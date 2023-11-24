import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/productRoutes";
import routerCart from "./routes/cartRoutes"
import routerUser from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import errorHandler from "./midleware/errorMidleware";
const cors = require ("cors");

dotenv.config();

if (!dotenv) {
  console.error("Error loading .env file:", dotenv);
}

const app = express();
app.use(cors({origin: ["http://localhost:3500", "http://localhost:8000/api"]}))
// Express middleware for parsing JSON
app.use(express.json());
// Use the cookie-parser middleware
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
// Make sure this comes before route handlers.


// Define routes
app.use("/api/products", router);
app.use("/api/cart", routerCart);
app.use("/api/user", routerUser);

// Define a basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({message: "Home Page"});
});

const PORT: string | number = process.env.PORT || 8000;
const uri: string | undefined = process.env.MONGO_URI;

//Error MiddleWare
app.use(errorHandler);

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



 