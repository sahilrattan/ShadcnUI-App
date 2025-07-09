const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;
const ACCESS_SECRET = "access_secret_key";
const REFRESH_SECRET = "refresh_secret_key";

app.use(cors());
app.use(bodyParser.json());

const dummyUser = {
  email: "test@gmail.com",
  password: "password123",
};

let refreshTokens = []; // store issued refresh tokens

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(user, ACCESS_SECRET, { expiresIn: "15m" }); // short expiry
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });
  refreshTokens.push(refreshToken);
  return refreshToken;
};

// Login endpoint
app.post("/identity/login", (req, res) => {
  const { email, password } = req.body;

  if (email === dummyUser.email && password === dummyUser.password) {
    const user = { email };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.json({ accessToken, refreshToken });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// Refresh token endpoint
app.post("/api/refresh-token", (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: "Token required" });
  if (!refreshTokens.includes(token))
    return res.status(403).json({ message: "Invalid refresh token" });

  jwt.verify(token, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token expired" });

    const newAccessToken = generateAccessToken({ email: user.email });
    res.json({ accessToken: newAccessToken });
  });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
