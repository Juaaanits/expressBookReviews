const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
      const getBooks = () => {
        return new Promise((resolve, reject) => {
          resolve(books);
        });
      };
  
      const allBooks = await getBooks();
      res.send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
      res.status(500).json({ message: "Error fetching books" });
    }
  });

// Get book details based on ISBN
// Task 11 - Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      });
    };
  
    try {
      const book = await getBookByISBN(isbn);
      res.send(book);
    } catch (err) {
      res.status(404).json({ message: err });
    }
  });
  
  
  
// Get book details based on author
// Task 12 - Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
  
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const results = Object.values(books).filter(
          (book) => book.author.toLowerCase() === author
        );
        if (results.length > 0) {
          resolve(results);
        } else {
          reject("Author not found");
        }
      });
    };
  
    try {
      const booksByAuthor = await getBooksByAuthor(author);
      res.send(booksByAuthor);
    } catch (err) {
      res.status(404).json({ message: err });
    }
  });
  

// Get all books based on title
// Task 13 - Get book details based on title using async/await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
  
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const results = Object.values(books).filter(
          (book) => book.title.toLowerCase() === title
        );
        if (results.length > 0) {
          resolve(results);
        } else {
          reject("Title not found");
        }
      });
    };
  
    try {
      const booksByTitle = await getBooksByTitle(title);
      res.send(booksByTitle);
    } catch (err) {
      res.status(404).json({ message: err });
    }
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      res.send(books[isbn].reviews);
    } else {
      res.status(404).send({ message: "Book not found" });
    }
});

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (users.find(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully." });
  });
  

module.exports.general = public_users;
