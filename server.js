const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true
}));
app.use(express.urlencoded({ extended: true }));

// Static folders
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Routes
const bookRoutes = require("./routes/bookRoutes");
app.use("/api/books", bookRoutes);

// Connect DB

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
// Start server

// ================= ADMIN LOGIN =================

app.post("/admin/login", (req, res) => {
    const { username, password } = req.body;

    const validUser = process.env.ADMIN_USERNAME || "drdriver101";
    const validPass = process.env.ADMIN_PASSWORD || "AMIYOURSK";

    if (username === validUser && password === validPass) {
        req.session.admin = true;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// ================= ADMIN LOGOUT =================

app.get("/admin/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/admin-login.html");
});

// ================= PROTECTED ADMIN PAGE =================

app.get("/admin", (req, res) => {
    if (req.session.admin) {
        res.sendFile(__dirname + "/public/admin.html");
    } else {
        res.redirect("/admin-login.html");
    }
});

const PORT = process.env.PORT || 5000;

// ================= KEEP-ALIVE SYSTEM =================
// Automatically prevents Render's free tier from sleeping every 15 minutes.
const https = require("https");
setInterval(() => {
    const url = process.env.RENDER_EXTERNAL_URL || "https://drdash-1a1s.onrender.com";
    if (url) {
        https.get(url, (res) => {
            if (res.statusCode === 200) console.log("Keep-alive ping sent successfully");
        }).on("error", (err) => console.log("Keep-alive ping failed:", err.message));
    }
}, 14 * 60 * 1000); // Pings exactly every 14 minutes

app.listen(PORT, () => {
    console.log("Server running...");
});