const bcrypt = require("bcrypt")
const User = require("../models/User")
const IssueRequest = require("../models/Request")
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

// exports.issue = async (req, res) => {
//     try {
//         const { bookId, userId } = req.body;
    
//         const book = await Book.findById(bookId);
//         if (!book) {
//           return res.status(404).json({ error: 'Book not found' });
//         }
    
//         const user = await User.findById(userId);
//         if (!user) {
//           return res.status(404).json({ error: 'User not found' });
//         }
    
//         if (book.issuedTo) {
//           return res.status(400).json({ error: 'Book is already issued' });
//         }
    
//         book.issuedTo = userId;
//         await book.save();
    
//         user.issuedBooks.push(bookId);
//         await user.save();
    
//         res.status(200).json({ message: 'Book issued successfully' });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
// }

exports.createRequest = async (req, res) => {
    try {
        const { bookId, userId } = req.body;
            const book = await Book.findById(bookId);
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
    
        if (book.issuedTo) {
          return res.status(400).json({ error: 'Book is already issued' });
        }
    
        const request = new IssueRequest({
          book: bookId,
          user: userId,
          status: 'pending'
        });
        await request.save();
        
        res.status(200).json({ message: 'Book issue request sent for approval' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

exports.reviewRequest = async (req, res) => {
    try {
        const requests = await IssueRequest.find({ status: 'pending' }).populate('book').populate('user');
        res.status(200).json( requests );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

exports.approveRequest = async(req, res) => {
    try {
        const { requestId, status } = req.body;

        if (!requestId || !status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const request = await IssueRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        request.status = status;
        await request.save();

        if (status === 'approved') {
            const book = await Book.findById(request.book);
            const user = await User.findById(request.user);

            if (!book || !user) {
                return res.status(404).json({ error: 'Book or user not found' });
            }

            book.issuedTo = user._id;
            await book.save();

            user.issuedBooks.push(book._id);
            await user.save();
        }

        res.status(200).json({ message: 'Request reviewed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}