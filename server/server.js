const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// Test route за root
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Import routes
const routes = require("./routes/routes");
app.use("/api/notes", routes);

// Retry логика за MongoDB конекција
const connectWithRetry = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log("MongoDB connected");
            app.listen(process.env.PORT || 5000, () => console.log("Server running"));
        })
        .catch(err => {
            console.log("MongoDB connection failed, retrying in 5 sec...", err);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();
