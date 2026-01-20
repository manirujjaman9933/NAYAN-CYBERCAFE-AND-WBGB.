const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname)); // VERY IMPORTANT

// Serve index.html at root (/)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API to get data
app.get("/data", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
  res.json(data);
});

// API to save data
app.post("/save", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
  data.push(req.body);
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});