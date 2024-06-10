const mongoose = require("mongoose");

// Define the Tags schema
const bookSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	description: { type: String },
	author : {type: String},
    isbn : {
        type : Number
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
		// 	ref: "Category",
        type:String
    },
    quantity: {
        type: Number,
        default: 1
    },
    rackNo : {
        type: Number
    },
    fine : {type: Number},
    duration : {type: Number, default: 7},
    price: {type: Number},
    issuedDate: {
        type: Date
    },
    returnDate: {
        type: Date
    },
    imageUrl : {
        type : String
    },

});

// Export the Tags model
module.exports = mongoose.model("Book", bookSchema);