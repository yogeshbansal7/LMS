const User = require("../models/User")
const Library = require("../models/Library")

exports.createLibrary = async (req, res) => {
    try {
        const { capacity } = req.body;
        const library = new Library({ 
            capacity, 
           });
        await library.save();
        res.json(library);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.check = async (req, res) => {
    try {
        const { userId } = req.body;
        const library = await Library.findOne(); // Assuming there's only one library entry in the database
        const index = library.users.indexOf(userId);
        if (index !== -1) {
            // User is already present, so check them out
            library.present--;
            library.users.splice(index, 1);
            await library.save();
            res.json({ 
                message: 'User checked out successfully' ,
                present: library.present,
                capacity: library.capacity,
                total: library.total
                

                
                
            });
        } else {
            // User is not present, so check them in
            if (library.present < library.capacity) {
                library.present++;
                library.users.push(userId);
                await library.save();
                res.json({ message: 'User checked in successfully' ,
                present: library.present,
                capacity: library.capacity,
                total: library.total });
            } else {
                res.status(400).json({ message: 'library is full' ,
                present: library.present,
                capacity: library.capacity,
                total: library.total});
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'internal server error'  });
    }
};