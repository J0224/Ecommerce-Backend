import express, { Request, Response } from "express";
import session from "express-session";
const MongoDBStore = require('connect-mongodb-session')(session);
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/productRoutes";
import routerCart from "./routes/cartRoutes";
import routerUser from "./routes/userRoutes";
import routerAdmin from "./routes/adminRoutes";
import cookieParser from "cookie-parser";
import errorHandler from "./midleware/errorMidleware";
import cors from "cors";
import path = require("path");


dotenv.config();

if (!dotenv) {
  console.error("Error loading .env file:", dotenv);
}

const app = express();

// Allow requests from the specified origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:8000"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);

// Express middleware for parsing JSON
app.use(express.json());
// Use the cookie-parser middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
// Make sure this comes before route handlers.
app.use("/Store-Photos", express.static(path.join(__dirname, "Store-Photos")))

// Set up express-session middleware
const store = new MongoDBStore({
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017/product-list',
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24, // 1 day
})

const sessionConfig: session.SessionOptions & { secret?: string } = {
  secret: process.env.JWT_SECRET || "",
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: true,
  },
};


if (process.env.JWT_SECRET) {
  sessionConfig.secret = process.env.JWT_SECRET;
} else {
  console.warn("JWT_SECRET not defined. Sessions will not be secure.");
  // Optionally, handle the case where JWT_SECRET is not defined.
  // You might want to log a warning and skip using express-session.
}

app.use(session(sessionConfig));



// Define routes
app.use("/api/products", router);
app.use("/api/cart", routerCart);
app.use("/api/user", routerUser);
app.use("/api/admin", routerAdmin);

// Define a basic route for testing
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Home Page" });
});

const PORT: string | number = process.env.PORT || 8000;
const uri: string | undefined = process.env.MONGO_URI;



if (!uri) {
  console.log("Missing required ENV file");
  throw new Error("Missing required ENV file");
}

// Error MiddleWare
app.use(errorHandler);

// Connect to the database
mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
