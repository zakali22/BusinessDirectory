
var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

User = require('../models/user.js');

// Access control
const ensureAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/user/login');
	}
};

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
		res.redirect('/business');
});

router.get('/profile/:id', (req, res, next) => {
	User.findOne({username: req.params.id}, (err, user) => {
		if(err){
			console.log(err);
		}
		console.log(user);
		if(user){
			res.render('profile', {
				title: user.username + "'s Profile",
				user: user,
				isAuthenticated: req.isAuthenticated()
			});
		}
	});
});

router.get('/add', (req, res, next) => {
	res.render('addProfile', {
		title: 'Register',
		errors: null,
		isAuthenticated: req.isAuthenticated()
	});
});

router.post('/add', (req, res, next) => {
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('confirm', 'Passwords do not match').equals(req.body.password);

	let errors = req.validationErrors();
	if(errors){
		res.render('addProfile', {
			title: 'Register',
			errors: errors,
			isAuthenticated: req.isAuthenticated()
		})
	} else {
		const user = new User({
			name: req.body.first,
			username: req.body.username,
			email: req.body.email,
			password: req.body.password
		});

		User.registerUser(user, (err, user) => {
			console.log(user);
			if(err){
				console.log(err);
			}
			req.flash('success', 'You have registered successfully');
			res.redirect('/user/login');
		});
	}
});

router.get('/login', (req, res, next) => {
	res.render('login', {
		title: 'Login',
		errors: null,
		isAuthenticated: req.isAuthenticated()
	})
});

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.getUserById(id, (err, user) => {
		done(err, user);
	});
});
// Create a local strategy
passport.use(new LocalStrategy((username, password, done) => {
	User.getUserByUsername(username, (err, user) => {
		if(err) throw err;
		if(!user){
			return done(null, false, {message: 'Username is incorrect'});
		}
		User.comparePasswords(password, user.password, (err, isMatch) => {
			if(err) throw err;
			if(isMatch){
				return done(null, user);
			} else {
				return done(null, false, {message: 'Password is incorrect'});
			}
		});
	});
}));

// Login Post request

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/user/login',
		failureFlash: true
	})(req, res, next);
});


// Logout request
router.get('/logout', (req, res, next) => {
	req.logout();
	req.flash('success', 'You are logged out');
	res.redirect('/user/login');
});


module.exports = router;
