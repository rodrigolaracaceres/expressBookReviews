const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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

// AXIOS Get the book list available in the shop
public_users.get('/axiosBooks', async function (req, res) {
  try {
    // Si books es una variable que contiene la lista de libros, no la URL
    const bookList = books; // No necesitamos hacer una solicitud, ya tenemos los libros
    return res.status(200).json(bookList);
  } catch (error) {
    console.error('Error al obtener la lista de libros:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get book details based on ISBN
 public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const booked = books[isbn]; 
  return res.status(200).json({booked});
 });

// AXIOS book details based on ISBN
public_users.get('/AXIOSisbn/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener información del libro:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
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

// AXIOS book details based on author
public_users.get('/AXIOSauthor/:author', async function (req, res) {
  try {
    const authorname = req.params.author;
    let booked = [];

    // Iterar sobre todos los libros y buscar los que coincidan con el autor
    for (const key in books) {
      if (books[key].author === authorname) {
        booked.push(books[key]);
      }
    }

    if (booked.length > 0) {
      return res.status(200).json({ books: booked });
    } else {
      return res.status(404).json({ error: 'Libros del autor no encontrados' });
    }
  } catch (error) {
    console.error('Error al obtener libros del autor:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
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
