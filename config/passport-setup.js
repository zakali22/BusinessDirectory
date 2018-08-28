var passport = require('passport');
const keys = require('./keys.js');
var GooglePlusStrategy = require('passport-google-plus');
module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
	passport.use(new GooglePlusStrategy({
	    clientId: keys.google.clientID,
	    clientSecret: keys.google.clientSecret
	  },
	  function(tokens, profile, done) {
	    // Create or update user, call done() when complete...
	    console.log(profile);
	    done(null, profile, tokens);
	  }
	));
};