const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username && typeof username === 'string';
};

const authenticatedUser = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  return !!user;
};

// Task 7: Login Route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  let accessToken = jwt.sign({ username }, "access", { expiresIn: '1h' });
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "User successfully logged in", token: accessToken });
});

// Task 8: Add or Modify Book Review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "Unauthorized user" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Task 9: Delete Book Review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username || !books[isbn]) {
    return res.status(403).json({ message: "Invalid request" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found for user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;