const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT = 5000;
const secretKey = "access"; // should match what was used to sign the token

app.use(express.json());

// Set up session
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// 🔐 Auth middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const token = req.session.authorization.accessToken;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // Attach user data to req
    next(); // Pass control to the next middleware/route
  });
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log("Server is running on port " + PORT));
