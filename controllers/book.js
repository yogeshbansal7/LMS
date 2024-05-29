const bcrypt = require("bcrypt")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const mailSender = require("../utils/mailSender")
const Book = require("../models/Book")
require("dotenv").config()


exports.addbook = async (req, res) => {
  console.log("wgefvjsbfekwjefb");

  const { name, description, author, isbn, category, rackNo, price } = req.body;
  try{

    const newBook = new Book({
      name,
      description,
      author,
      isbn,
      category,
      rackNo,
      price
    });

    await newBook.save();

    res.status(201).json({ message: 'Book added successfully.', book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


}
