const mongoose = require("mongoose");

// Define the Tags schema
const eventSchema = new mongoose.Schema({
	imageName: {
		type: String,
	},
	title: { type: String },
	startDate : {type: Date},
    endDate : {
        type : Date
    },
    time: {
        type:String
    },
    language: {
        type: String,
    },
    genre : {
        type: String
    },
    description : {type: String},
});

// Export the Tags model
module.exports = mongoose.model("Event", eventSchema);