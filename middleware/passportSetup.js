const passport = require('passport');
const GoogleOAuth2Strategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleOAuth2Strategy({
    clientID: 'process.env.your_client_id',
    clientSecret: 'process.env.your_client_secret',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Verify callback logic
    // This function will be called after successful authentication
    // 'profile' will contain user profile information
    return done(null, profile);
  }
));
