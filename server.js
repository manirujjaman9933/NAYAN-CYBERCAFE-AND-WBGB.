const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Path to users.json
const USERS_FILE = path.join(__dirname, "users.json");

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Server is running");
});

/* =========================
   USERS ROUTE (FIXES Cannot GET /users)
========================= */
app.get("/users", (req, res) => {
  fs.readFile(USERS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read users file" });
    }
    res.json(JSON.parse(data));
  });
});

/* =========================
   LOGIN ROUTE
========================= */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fs.readFile(USERS_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    const users = JSON.parse(data);

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.json({ success: false });
    }

    // Role-based redirect
    if (user.role === "admin") {
      return res.json({ success: true, role: "admin" });
    } else {
      return res.json({ success: true, role: "retailer" });
    }
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
