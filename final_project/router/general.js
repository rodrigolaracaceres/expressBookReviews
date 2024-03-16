const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// add user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bookList = books;
  return res.status(200).json(bookList);
});

// Get book details based on ISBN
 public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const booked = books[isbn]; 
  return res.status(200).json({booked});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorname = req.params.author;
  let booked;
  for (const key in books) {
    if(books[key].author == authorname){
      booked = books[key];
    };
  }
  return res.status(300).json({booked});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booked;
  for (const key in books) {
    if(books[key].title == title){
      booked = books[key];
    };
  }
  return res.status(200).json({booked});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const review = books[isbn].reviews; 
  return res.status(200).json({review});
});

module.exports.general = public_users;
