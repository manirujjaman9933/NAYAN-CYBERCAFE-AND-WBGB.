const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const USERS_FILE = "users.json";
const DATA_FILE = "data.json";

const readJSON = f => JSON.parse(fs.readFileSync(f));
const writeJSON = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

// Auto delete after 5 days
function cleanOldData() {
  let data = readJSON(DATA_FILE);
  const now = Date.now();
  data = data.filter(x => now - x.timestamp < 5 * 24 * 60 * 60 * 1000);
  writeJSON(DATA_FILE, data);
}
cleanOldData();

// LOGIN
app.post("/login", (req, res) => {
  const { id, password } = req.body;
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.id === id && u.password === password);
  if (!user) return res.json({ success: false });
  res.json({ success: true, role: user.role, id: user.id });
});

// CREATE RETAILER
app.post("/createRetailer", (req, res) => {
  const users = readJSON(USERS_FILE);
  users.push({ id: req.body.id, password: req.body.password, role: "retailer" });
  writeJSON(USERS_FILE, users);
  res.json({ success: true });
});

// ADD DATA (WITH AADHAAR)
app.post("/addData", (req, res) => {
  const data = readJSON(DATA_FILE);
  data.push({
    retailer: req.body.retailer,
    name: req.body.name,
    mobile: req.body.mobile,
    aadhaar: req.body.aadhaar,
    status: "Pending",
    timestamp: Date.now()
  });
  writeJSON(DATA_FILE, data);
  res.json({ success: true });
});

// GET DATA
app.get("/data", (req, res) => {
  cleanOldData();
  res.json(readJSON(DATA_FILE));
});

// UPDATE STATUS
app.post("/status", (req, res) => {
  const data = readJSON(DATA_FILE);
  data[req.body.index].status = req.body.status;
  writeJSON(DATA_FILE, data);
  res.json({ success: true });
});

// DELETE
app.post("/delete", (req, res) => {
  const data = readJSON(DATA_FILE);
  data.splice(req.body.index, 1);
  writeJSON(DATA_FILE, data);
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));