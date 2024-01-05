const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const user = req.body.user;

  if (!user) {
    return res.status(404).json({ message: "Body empty" });
  }

  if (authenticatedUser(user.username, user.password)) {
    let accessToken = jwt.sign({
      data: user
    }, "access", { expiresIn: 60 * 60 });

    req.session.authorization = { accessToken };
    return res.status(200).send(`User: ${user.username} successfully logged in`);
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const currentUser = req.user;
  const review = req.body.review;

  if (isbn) {
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews[currentUser.data.username]) {
      books[isbn].reviews[currentUser.data.username] = review;
      return res.status(200).json({ message: "Successfully updated review" });
    } else {
      books[isbn].reviews[currentUser.data.username] = review;
      return res.status(200).json({ message: "Successfully added review" });
    }
  }
});

// delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const currentUser = req.user;

  if (isbn) {
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews[currentUser.data.username]) {
      delete books[isbn].reviews[currentUser.data.username];

      return res.status(200).json({ message: "Successfully deleted review" });
    }
    return res.status(400).json({ message: "Could not delete review" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
