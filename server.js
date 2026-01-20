const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path to users.json
const usersPath = path.join(__dirname, "users.json");

// Read users safely
function getUsers() {
  const data = fs.readFileSync(usersPath, "utf-8");
  return JSON.parse(data);
}

// Home route
app.get("/", (req, res) => {
  res.send(`
    <h1>NAYAN CYBERCAFE AND WBGB</h1>
    <form method="POST" action="/login">
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  `);
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = getUsers();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  // Role-based response (NO redirect bug)
  if (user.role === "admin") {
    return res.send("Admin login successful");
  }

  if (user.role === "retailer") {
    return res.send("Retailer login successful");
  }

  res.send("Login successful");
});

// Users API (fixes Cannot GET /users)
app.get("/users", (req, res) => {
  const users = getUsers();
  res.json(users);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
