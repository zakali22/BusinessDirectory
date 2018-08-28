var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

Business = require('../models/business.js');
Category = require('../models/category.js');
User = require('../models/user.js');


const NodeGeocoder = require('node-geocoder');


// Geocoding Middleware
const options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: 'AIzaSyCh2nrSJxlepFn_9h4OuxqQPrq8yog3wU8',
	formatter: null
};

const geocoder = NodeGeocoder(options);

// Access control
const ensureAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()){
		//console.log(req.isAuthenticated());
		return next();
	} else {
		res.redirect('/user/login');
	}
};


router.get('/', function(req, res, next) {
	Business.findAllBusinesses((err, businesses) => {
		if(err){
			console.log(err);
		}
		res.render('businesses', {
	  		title: 'Business Listings',
	  		businesses: businesses,
	  		isAuthenticated: req.isAuthenticated()
	  	});
	});
});

router.get('/show/:id', (req, res, next) => {
	const queryId = {_id: req.params.id};
	Business.findBusiness(queryId, (err, business) => {
		if(err){
			console.log(err);
		}
		let counter = 0;
		business.comments.forEach((comment) => {
			counter += comment.comment_stars;
		});
		let average = counter / business.comments.length;
		console.log(average);
		Business.updateBusiness(queryId, {$set: {average_stars: average}}, (err, average) => {
			res.render('business', {
				title: business.businessName,
				business: business,
				isAuthenticated: req.isAuthenticated()
			})
		});
	});
});

router.get('/category/:id', (req, res, next) => {
	const queryId = {_id: req.params.id};
	Category.findACategory(queryId, (err, category) => {
		const query = {category: category.title}
		Business.findByCategory(query, (err, businesses) => {
			if(err){
				console.log(err);
			}
			res.render('businesses', {
				title: category.title + ' Businesses',
				businesses: businesses,
				isAuthenticated: req.isAuthenticated()
			});
		});
	});
});

router.get('/add', (req, res, next) => {
	Category.findCategories((err, categories) => {
		if(err){
			console.log(err);
		}
		res.render('addBusiness', {
			title: 'Add a business',
			categories: categories,
			errors: null,
			isAuthenticated: req.isAuthenticated()
		});
	});
});


router.post('/add', (req, res, next) => {
	const newBusiness = new Business({
		businessName: req.body.businessName,
		ownerName: req.body.ownerName,
		category: req.body.category,
		phone: req.body.phone,
		description: req.body.description,
		slogan: req.body.slogan,
		address: {
			street: req.body.street,
			city: req.body.city,
			postcode: req.body.postcode
		}
	});

	req.checkBody('businessName', 'Business name is required').notEmpty();
	req.checkBody('ownerName', 'Owner name is required').notEmpty();
	req.checkBody('category', 'Category is required').notEmpty();
	req.checkBody('phone', 'Phone is required').notEmpty();
	req.checkBody('description', 'Description is required').notEmpty();
	req.checkBody('street', 'Street is required').notEmpty();
	req.checkBody('city', 'City is required').notEmpty();
	req.checkBody('postcode', 'Post code is required').notEmpty();


	let errors = req.validationErrors();
	if(errors){
		Category.findCategories((err, categories) => {
			if(err){
				console.log(err);
			}
			res.render('addBusiness', {
				title: 'Add a business',
				categories: categories,
				errors: errors,
				isAuthenticated: req.isAuthenticated()
			});
		});
	} else {
		const location = newBusiness.address.street + ' ' + newBusiness.address.city + ' ' + newBusiness.address.postcode; 
		Business.addBusiness(newBusiness, (err, business) => {
			if(err){
				console.log(err);
			}
			res.redirect('/business');
		});
	}
});


router.post('/search', (req, res, next) => {
	const query = {businessName: req.body.search};

	Business.findBusiness(query, (err, business) => {
		if(err){
			console.log(err);
		}
		if(business){
			res.render('business', {
				title: 'Business Listings',
				business: business
			});
		}
	});
});

router.get('/write_review/:id', ensureAuthenticated, (req, res, next) => {
	const queryId = {_id: req.params.id};

	Business.findBusiness(queryId, (err, business) => {
		if(err){
			console.log(err);
		} 
		res.render('review', {
			title: 'Write a review',
			business: business,
			isAuthenticated: req.isAuthenticated()
		});	
	});
});

router.post('/write_review/submit/:id', ensureAuthenticated, (req, res, next) => {
	const queryId = {_id: req.params.id};
	const comment = {
		comment_author: req.user.username, 
		comment_title: req.body.title,
		comment_body: req.body.body,
		comment_stars: req.body.stars
	};
	Business.updateBusiness(queryId, {$push: {comments: comment}}, (err, comment) => {
		User.updateUser(req.user.username, {$push: {comments:{
			comment_author: req.user.username, 
			comment_title: req.body.title,
			comment_body: req.body.body,
			comment_stars: req.body.stars
		}}}, (err, user) => {
			if(err){
				console.log(err);
			}
			res.redirect('/business');
		});
	})
})
module.exports = router;
