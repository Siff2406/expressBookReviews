const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBookCollection = () => Promise.resolve().then(() => books);

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || !username.trim() ||
      typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res, next) {
  getBookCollection()
    .then((bookCollection) => res.json(bookCollection))
    .catch(next);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res, next) {
  getBookCollection()
    .then((bookCollection) => {
      const book = bookCollection[req.params.isbn];
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      return res.json(book);
    })
    .catch(next);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res, next) {
  getBookCollection()
    .then((bookCollection) => {
      const author = req.params.author.toLowerCase();
      const matchingBooks = Object.values(bookCollection).filter(
        (book) => book.author.toLowerCase() === author
      );
      return res.json(matchingBooks);
    })
    .catch(next);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res, next) {
  getBookCollection()
    .then((bookCollection) => {
      const title = req.params.title.toLowerCase();
      const matchingBooks = Object.values(bookCollection).filter(
        (book) => book.title.toLowerCase() === title
      );
      return res.json(matchingBooks);
    })
    .catch(next);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.json(book.reviews);
});

module.exports.general = public_users;
