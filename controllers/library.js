const User = require("../models/User")
const Library = require("../models/Library")

exports.check = async(req, res) => {
    try {
        const { userId } = req.body;
        const library = await Library.findOne();
        const index = library.users.indexOf(userId);
        if (index !== -1) {
            // User is already present, so check them out
            library.occupiedSeats--;
            library.users.splice(index, 1);
            await library.save();
            res.json({ 
                message: 'Checked out successfully' ,
                occupied: occupiedSeats,
                total: totalSeats
            });
        } else {
            if (library.occupiedSeats < library.totalSeats) {
                // User is not present and there is space, so check them in
                library.occupiedSeats++;
                library.users.push(userId);
                await library.save();
                res.json({ 
                    message: 'Checked in successfully' ,
                    occupied: occupiedSeats,
                    total: totalSeats
                });
            } else {
                
                res.status(400).json({ 
                    message: 'Library is full' ,
                    occupied: occupiedSeats,
                    total: totalSeats
                });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
}
