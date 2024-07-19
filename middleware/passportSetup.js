const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');

dotenv.config();


const db = require('../database/db'); 

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await db.query("SELECT * FROM User WHERE id = ?", [id]);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists in the database
    const [existingUser] = await db.query("SELECT * FROM User WHERE googleId = ?", [profile.id]);

    if (existingUser.length > 0) {
      return done(null, existingUser[0]);
    }

    // If the user doesn't exist, create a new user
    const newUser = await db.query(
      "INSERT INTO User (googleId, email, firstName, lastName) VALUES (?, ?, ?, ?)",
      [profile.id, profile.emails[0].value, profile.name.givenName, profile.name.familyName]
    );

    const [user] = await db.query("SELECT * FROM User WHERE id = ?", [newUser.insertId]);

    done(null, user[0]);
  } catch (err) {
    done(err, null);
  }
}));

module.exports = passport;
