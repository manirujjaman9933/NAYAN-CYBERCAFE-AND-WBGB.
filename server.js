const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Load users
const users = JSON.parse(fs.readFileSync("users.json", "utf8"));

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  if (user.role === "admin") {
    return res.redirect("/admin.html");
  }

  if (user.role === "retailer") {
    return res.redirect("/retailer.html");
  }

  res.status(403).send("Unauthorized role");
});

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
