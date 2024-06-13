const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        // enum: ["User", "Admin", "Librarian"],
        // required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    image: {
        type: String,
    },
    issuedBooks: [
        {   
            bookName: String,
            bookIsbn : Number,
            book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
            status: {
                type: String,
                enum: ["pending", "approved", "rejected", "submitted"],
                default: "pending"
            }
        }
    ],
    fine: {
        type: Number,
        default: 0
    },
  
}, { timestamps: true });

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("User", userSchema);
