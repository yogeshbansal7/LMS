const mongoose = require("mongoose");

// Define the Tags schema
const librarySchema = new mongoose.Schema({
    capacity: {
        type: Number,
    },
    total: {
        type: Number
    },
    present: {
        type: Number
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" 
        }
    ]
});

// Export the Tags model
module.exports = mongoose.model("Library", librarySchema);