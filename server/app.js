const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const menuRoutes = require("./routes/menuRoutes");
const tableRoutes = require("./routes/tableRoutes");

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Restaurant POS API is running",
    });
});

app.use("/api/admin", adminRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);

module.exports = app;