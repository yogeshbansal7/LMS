const User = require("../models/User")

exports.addevent = async(req, res) => {
    try {

        console.log("Creatiung event.. .... . .. ")
        const { imageName, title, startDate, endDate, time, language, genre, description } = req.body;
        const thumbnail = req.files.file

        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        console.log(thumbnailImage)
    
        const event = new Event({
          imageName: thumbnailImage.secure_url,
          title,
          startDate,
          endDate,
          time,
          language,
          genre,
          description
        });
        await event.save();

        console.log("succ event creation")
    
        res.status(201).json({ message: "Event created successfully", event });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  
}

exports.allevent = async(req, res) => {
    console.log("geting all events . .. .. .")
    try {
        // Query all events from the database
        const events = await Event.find();
    
        res.status(200).json(events);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}