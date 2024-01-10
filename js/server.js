"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const MongoDBStore = require('connect-mongodb-session')(express_session_1.default);
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorMidleware_1 = __importDefault(require("./midleware/errorMidleware"));
const cors_1 = __importDefault(require("cors"));
const path = require("path");
dotenv_1.default.config();
if (!dotenv_1.default) {
    console.error("Error loading .env file:", dotenv_1.default);
}
const app = (0, express_1.default)();
// Allow requests from the specified origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:8000"];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));
// Express middleware for parsing JSON
app.use(express_1.default.json());
// Use the cookie-parser middleware
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
// Make sure this comes before route handlers.
app.use("/Store-Photos", express_1.default.static(path.join(__dirname, "Store-Photos")));
// Set up express-session middleware
const store = new MongoDBStore({
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/product-list',
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24, // 1 day
});
const sessionConfig = {
    secret: process.env.JWT_SECRET || "",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
    },
};
if (process.env.JWT_SECRET) {
    sessionConfig.secret = process.env.JWT_SECRET;
}
else {
    console.warn("JWT_SECRET not defined. Sessions will not be secure.");
    // Optionally, handle the case where JWT_SECRET is not defined.
    // You might want to log a warning and skip using express-session.
}
app.use((0, express_session_1.default)(sessionConfig));
// Define routes
app.use("/api/products", productRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
// Define a basic route for testing
app.get("/", (req, res) => {
    res.status(200).json({ message: "Home Page" });
});
const PORT = process.env.PORT || 8000;
const uri = process.env.MONGO_URI;
if (!uri) {
    console.log("Missing required ENV file");
    throw new Error("Missing required ENV file");
}
// Error MiddleWare
app.use(errorMidleware_1.default);
// Connect to the database
mongoose_1.default
    .connect(uri)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
})
    .catch((err) => console.log(err));
