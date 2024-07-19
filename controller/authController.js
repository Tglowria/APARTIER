const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const db = require('../database/db')

exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, password, email, phoneNumber } = req.body;

        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            });
        }

    //  Check if the email is already in use
    const [row] = await db.execute(
      "SELECT email FROM User WHERE email=?",
      [email]
    );

    if (row.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "The E-mail is already in use",
      });
    }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

         // Insert the user into the database
    const user = await db.query(
        "INSERT INTO User (firstName, lastName, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?)",
        [firstName, lastName, email, phoneNumber, hashedPassword]
      );
  
 // Prepare the response data
 const responseData = {
    id: user[0].insertId,
    firstName,
    lastName,
    email,
    phoneNumber,
  };

        const token = jwt.sign({ id: responseData.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({ message: "User saved successfully", token, responseData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error saving user", error: err.message });
    }
};

exports.login = async (req, res) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ message: "Please provide email and password" });
      }

      // Retrieve user from the database based on email
      const [users] = await db.execute(
          "SELECT * FROM User WHERE email = ?",
          [email]
      );

      if (users.length === 0) {
          return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = users[0];

      // Check if the password matches
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
      }


      // Prepare response data (excluding sensitive info like password)
      const responseData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
      };

      return res.status(200).json({ message: "Login successful", responseData });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

exports.changeUserRoleToAdmin = async (req, res) => {
    try {
        const { userId } = req.body;

        // Check if the user exists
        const [user] = await db.execute("SELECT * FROM User WHERE id = ?", [userId]);
        
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's role to 'admin'
        await db.execute("UPDATE User SET role = 'admin' WHERE id = ?", [userId]);

        return res.status(200).json({ message: "User role updated to admin successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating user role", error: err.message });
    }
};

