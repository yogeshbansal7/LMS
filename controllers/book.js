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

exports.allbooks = async (req, res) => {
    try {
        const books = await Book.find().populate('issuedTo');
        res.status(200).json({ books });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

exports.issue = async (req, res) => {
    try {
        const { bookId, userId } = req.body;
    
        const book = await Book.findById(bookId);
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
    
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        if (book.issuedTo) {
          return res.status(400).json({ error: 'Book is already issued' });
        }
    
        book.issuedTo = userId;
        await book.save();
    
        user.issuedBooks.push(bookId);
        await user.save();
    
        res.status(200).json({ message: 'Book issued successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}