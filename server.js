const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const syncRoutes = require("./routes/sync");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/") // No deprecated options
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
app.use("/admin", adminRoutes); // Admin routes
app.use("/user", userRoutes);   // User routes
app.use("/sync", syncRoutes);   // Sync routes

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, "build")));

// Catch-all route to serve React app for any unmatched routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});