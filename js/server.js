"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = require("dotenv").config();
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require("./midleware/errorMidleware");
const cors = require("cors");
if (!dotenv) {
    console.error("Error loading .env file:", dotenv);
}
const app = (0, express_1.default)();
// Express middleware for parsing JSON
app.use(express_1.default.json());
// Use the cookie-parser middleware
app.use(cookieParser());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Make sure this comes before route handlers.
// Define routes
app.use("/api/products", productRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
// Define a basic route for testing
app.get('/', (req, res) => {
    res.send("Home Page");
});
const PORT = process.env.PORT || 8000;
const uri = process.env.MONGO_URI;
if (!uri) {
    console.log("Missing required ENV file");
    throw new Error("Missing required ENV file");
}
// Connect to the database
mongoose_1.default
    .connect(uri)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
})
    .catch((err) => console.log(err));
