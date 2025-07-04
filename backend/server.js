const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;
const SECRET_KEY = "your_secret_key"; 

app.use(cors());
app.use(bodyParser.json());

const dummyUser = {
  email: "test@gmail.com",
  password: "password123",
};

// Login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Check credentials
  if (email === dummyUser.email && password === dummyUser.password) {
    // Create a JWT token
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "7d" });
    
    return res.json({ token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
