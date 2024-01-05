const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  if (userName && password) {
    if(isValid(userName)) {
      users.push({"username": userName, "password": password});
      return res.status(200).json( {message: "User created successfully"} );
    } else {
      return res.status(400).json( {message: "Username already exists"} );
    }
  }

  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  
  if (books) {
    return res.status(200).send(JSON.stringify({ books }, null, 4));
  }
  
  // error no books in database
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (isbn) {
    const bookInfo = books[isbn];

    if (!bookInfo) {
      return res.status(400).json({ message: `Cannot find book with isbn number: ${isbn}` });
    }
    return res.status(200).send(JSON.stringify({ bookInfo }, null, 4));
  }
  // else return error message
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  if (author) {
    const bookInfo = Object.values(books).filter(book => book.author === author);

    if(!bookInfo) {
      return res.status(400).json({ message: `Cannot find any books under the author name: ${author}` });
    }

    return res.status(200).send(JSON.stringify({ bookInfo }, null, 4));

  }

  // else return error message
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  if (title) {
    const bookInfo = Object.values(books).filter(book => book.title === title);

    if (!bookInfo) {
      return res.status(400).json({ message: `Cannot find any books with the title: ${title}` });
    }

    return res.status(200).send(JSON.stringify({ bookInfo }, null, 4));
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (isbn) {
    const reviews = Object.values(books).filter(book => book.isbn === isbn).map(book => book.reviews);

    if (!reviews) {
      return res.status(400).json({ message: `Could not retrieve any reviews under the isbn: ${isbn}` });
    }

    return res.status(200).send(JSON.stringify({ reviews }, null, 4));
  }

  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
