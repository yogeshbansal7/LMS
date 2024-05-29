const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: { type: String },
	courses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Book",
		},
	],
    canHold: {
        type : Boolean,
        default : true
    }
});

// Export the Tags model
module.exports = mongoose.model("Category", categorySchema);