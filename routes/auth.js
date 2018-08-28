const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../config/passport-setup');

auth(passport);
router.use(passport.initialize());
router.get('/', (req, res) => {
    res.json({
        status: 'session cookie not set'
    });
});
router.post('/google/callback', passport.authenticate('google'), function(req, res) {
    // Return user back to client
    res.send(req.user);
});

module.exports = router;