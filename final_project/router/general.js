const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  // Create promise-based callback
  const getBookList = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({ books }, null, 4)));
  });
  getBookList.then(() => console.log("Promise 10 resolved."));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    resolve(res.send(books[isbn]));
  });
  getBook.then(() => console.log("Promise 11 resolved"));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let booksByAuthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn]["author"] === req.params.author) {
      booksByAuthor.push({
        isbn: isbn,
        title: books[isbn]["title"],
        reviews: books[isbn]["reviews"],
      });
    }
  });
  const gewtBooksByAuthor = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({ booksByAuthor }, null, 4)));
  });
  gewtBooksByAuthor.then(() => console.log("Promise 12 resolved"));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let booksByTitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn]["title"] === req.params.title) {
      booksByTitle.push({
        isbn: isbn,
        author: books[isbn]["author"],
        reviews: books[isbn]["reviews"],
      });
    }
  });
  res.send(JSON.stringify({ booksByTitle }, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let review = isbn.reviews;

  return res.send(JSON.stringify({ review }, null, 4));
});

module.exports.general = public_users;
