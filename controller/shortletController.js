const db = require('../database/db');
const { processPayment } = require('../services/paymentService.js'); 
const cloudinary = require('../middleware/passportSetup.js');
const { upload } = require('../middleware/multerConfig.js');



exports.create = async (req, res) => {
    try {

      const userId = req.header('userId');
        const [user] = await db.query("SELECT * FROM User WHERE id = ?", [userId]);
  
        if (user.length === 0 || user[0].role === 'user') {
          return res.status(403).json({ message: 'Access denied' });
        }

        const { apartmentName, state, numberOfRooms, address, amountPerNight } = req.body;
        

        if (!apartmentName || !state || !numberOfRooms || !address || !amountPerNight) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Assuming amountPerNight is a number validation
        if (isNaN(amountPerNight) || amountPerNight <= 0) {
            return res.status(400).json({
                message: "Amount per night must be a valid positive number"
            });
        }

        // Insert the shortlet into the database
        const shortlet = await db.query(
            "INSERT INTO shortlets (apartmentName, state, numberOfRooms, address, amountPerNight) VALUES (?, ?, ?, ?, ?)",
            [apartmentName, state, numberOfRooms, address, amountPerNight]
        );

        // Prepare the response data
        const responseData = {
            id: shortlet[0].insertId,
            apartmentName,
            state,
            numberOfRooms,
            address,
            amountPerNight
        };

        return res.status(201).json({ message: "Shortlet saved successfully", responseData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error saving shortlet", error: err.message });
    }
};

exports.bookShortlet = async (req, res) => {
  const { id, currency, email, phone_number, numberOfNights } = req.body;
  try {
    // Check if the shortlet exists and is available
    const [existingShortletRow] = await db.query("SELECT * FROM shortlets WHERE id = ? AND booked = 0", [id]);

    if (!existingShortletRow || existingShortletRow.length === 0) {
      return res.status(404).json({ message: "Shortlet not found or already booked" });
    }

    const existingShortlet = existingShortletRow[0]; // Access the first (and presumably only) row
    console.log("existingShortlet:", existingShortlet);

    // Validate amountPerNight
    if (!existingShortlet.amountPerNight || isNaN(existingShortlet.amountPerNight)) {
      throw new Error("Invalid amountPerNight value");
    }

    // Calculate the total amount for the booking
    const totalAmount = existingShortlet.amountPerNight * numberOfNights;
    console.log("totalAmount:", totalAmount);
    console.log("amountPerNight:", existingShortlet.amountPerNight);
    console.log("numberOfNights:", numberOfNights);

    // Payment details
    const paymentDetails = {
      amount: totalAmount,
      currency,
      email,
      phone_number,
      fullname: `${existingShortlet.apartmentName}`,
      numberOfNights
    };

    // Process payment using Flutterwave
    const paymentResponse = await processPayment(paymentDetails);

    if (paymentResponse.status !== "success") {
      return res.status(400).json({ message: "Payment failed", data: paymentResponse });
    }

    // Update the shortlet to mark it as booked
    await db.query("UPDATE shortlets SET booked = 1 WHERE id = ?", [id]);

    return res.status(200).json({ 
      message: "Proceed To Make Payment", 
      totalAmount,
      paymentStatus: paymentResponse.status,
      paymentData: paymentResponse
    });
  } catch (err) {
    console.error("Error booking shortlet:", err);
    return res.status(500).json({ message: "Error booking shortlet", error: err.message });
  }
};

 exports.filterShortletsByState = async (req, res) => {
    const { state } = req.query;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    const offset = (page - 1) * limit;

    try {
        const [filteredShortlets] = await db.query(
            "SELECT * FROM shortlets WHERE state = ? LIMIT ? OFFSET ?",
            [state, parseInt(limit, 10), offset]
        );
        return res.status(200).json(filteredShortlets);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Error retrieving shortlets in state ${state}`, error: err.message });
    }
};


exports.getAllAvailableShortlets = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    const offset = (page - 1) * limit;

    try {
        const [availableShortlets] = await db.query(
            "SELECT * FROM shortlets WHERE booked = 0 LIMIT ? OFFSET ?",
            [parseInt(limit, 10), offset]
        );
        return res.status(200).json(availableShortlets);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error retrieving available shortlets", error: err.message });
    }
};


exports.getAllShortlets = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    const offset = (page - 1) * limit;

    try {
        const [shortlet] = await db.query(
            "SELECT * FROM shortlets LIMIT ? OFFSET ?",
            [parseInt(limit, 10), offset]
        );
        return res.status(200).json(shortlet);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error retrieving shortlets", error: err.message });
    }
};

exports.uploadShortletPictures = [
    upload.fields([
      { name: 'image1', maxCount: 1 }, // Field name for the first image
      { name: 'image2', maxCount: 1 }  // Field name for the second image
    ]),
    async (req, res) => {
      try {
        const userId = req.header('userId');
        const [user] = await db.query("SELECT * FROM User WHERE id = ?", [userId]);
  
        if (user.length === 0 || user[0].role === 'user') {
          return res.status(403).json({ message: 'Access denied' });
        }
  
        const shortletId = req.params.id; // The ID of the shortlet
        const [shortlet] = await db.query("SELECT * FROM shortlets WHERE id = ?", [shortletId]);
  
        if (shortlet.length === 0) {
          return res.status(400).json({ message: "Shortlet not found" });
        }
  
        // Upload image1 if provided
        let image1Url = shortlet[0].image1Url;
        if (req.files['image1']) {
          const result1 = await cloudinary.uploader.upload(req.files['image1'][0].path);
          image1Url = result1.secure_url;
        }
  
        // Upload image2 if provided
        let image2Url = shortlet[0].image2Url;
        if (req.files['image2']) {
          const result2 = await cloudinary.uploader.upload(req.files['image2'][0].path);
          image2Url = result2.secure_url;
        }
  
        // Update shortlet with the image URLs
        await db.query(
          "UPDATE shortlets SET image1Url = ?, image2Url = ? WHERE id = ?",
          [image1Url, image2Url, shortletId]
        );
  
        return res.status(200).json({
          message: "Pictures saved successfully",
          data: {
            ...shortlet[0],
            image1Url,
            image2Url
          },
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error uploading pictures", error: err.message });
      }
    }
  ];