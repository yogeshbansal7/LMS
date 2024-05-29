const mongoose = require("mongoose");

// Define the Tags schema
const bookSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: { type: String },
	author : {type: String},
    isbn : {
        type : Number
    },
    issuedTo : {
        type: mongoose.Schema.Types.ObjectId,
		ref: "User",
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
		// 	ref: "Category",
        type:String
    },
    rackNo : {
        type: Number
    },
    fine : {type: Number},
    duration : {type: Number, default: 7},
    price: {type: Number}

});

// Export the Tags model
module.exports = mongoose.model("Book", bookSchema);