
const bcrypt = require("bcrypt")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const mailSender = require("../utils/mailSender")
const Book = require("../models/Book")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()

exports.addbook = async (req, res) => {
  console.log("adding book....")

  const { title, author, isbn, category, amount, notes, shelf, quantity } = req.body;
  const thumbnail = req.files.file
  try{


    const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      console.log(thumbnailImage)
      


    const newBook = new Book({
      name : title,
      description : notes,
      author,
      isbn,
      category,
      rackNo : shelf,
      price : amount,
      imageUrl : thumbnailImage.secure_url,
      quantity: quantity
    });

    console.log(newBook)
    console.log("Done adding a book")
    await newBook.save();

    res.status(201).json({ message: 'Book added successfully.', book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

exports.allbooks = async (req, res) => {
  console.log("cominngggggggggg")
  try {
    let books = await Book.find(); 
    books = shuffleArray(books); 
    res.status(200).json({ books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.oneBook = async (req, res) => {
  const { uniqueId } = req.params;

  try {
      const book = await Book.findOne({ uniqueIds: { $in: [uniqueId] } });
      if (!book) {
          return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({ message: "Book found", book: book });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.oneBookByCreatedId = async (req, res) => {

  const uniqueId= req.params.uni;

  try {
    // Query the database to find the book
    const book = await Book.findOne({ isbn: uniqueId });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Return book details
    res.status(200).json( book );
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.createRequest = async (req, res) => {
  const { userId, bookId } = req.params;
  console.log(req.params);
  console.log("Creating Request")
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        if (user.issuedBooks.some(req => req.book.toString() === bookId)) {
            return res.status(400).json({ error: "You have already requested this book" });
        }

        const request = {bookName: book.name, bookIsbn: book.isbn , book: bookId, status: "pending" };
        user.issuedBooks.push(request);

        book.quantity -= 1;
        await book.save();

        await user.save();

        console.log("Successfully requeest created") 

        res.status(201).json({ message: "Request sent successfully", request });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.reviewRequest = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    let allRequests = [];

    for (const user of users) {
      for (const book of user.issuedBooks) {
        if (book.status === "pending") {
        const bookDetail = await Book.findOne({ isbn: book.bookIsbn });

        console.log(bookDetail)
        allRequests.push({
          userName: user.name,
          user: user._id,
          bookName: book.bookName,
          bookIsbn: book.bookIsbn,
          status: book.status,
          id: book._id,
          bookId: book.book,
          bookImageUrl: bookDetail.imageUrl
        });
      }}
    }

    res.status(200).json(allRequests );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
exports.approveRequest = async (req, res) => {
  console.log("approving req.....")
  const { userId, bookId } = req.params;
  console.log(req.params)

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user.issuedBooks)

    const request = user.issuedBooks.find(req => req.book.toString() === bookId && req.status === "pending");
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    request.status = "approved";

    await user.save();
    console.log("Successfully approved request");
    res.status(200).json({ message: "Request approved successfully", request });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.rejectRequest = async (req, res) => {
  console.log("rejecting req.....")
  const { userId, bookId } = req.params;
  console.log(req.params)

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user.issuedBooks)

    const request = user.issuedBooks.find(req => req.book.toString() === bookId && req.status === "pending");
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    request.status = "rejected";

    await user.save();

    const book = await Book.findById(request.book);
    if (book) {
      book.quantity += 1;
      await book.save();
    }


    console.log("Successfully rejected request");
    res.status(200).json({ message: "Request approved successfully", request });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.submitBook = async (req, res) => {
  console.log("submitting book.....")
  const { userId, bookId } = req.params;
  console.log(req.params)

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user.issuedBooks)

    const request = user.issuedBooks.find(req => req.book.toString() === bookId && req.status === "approved");
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    request.status = "submitted";

    await user.save();

    const book = await Book.findById(request.book);
    if (book) {
      book.quantity += 1;
      await book.save();
    }
    
    console.log("Successfully submitted request");
    res.status(200).json({ message: "Request approved successfully", request });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};