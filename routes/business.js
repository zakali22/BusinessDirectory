var express = require('express');
var router = express.Router();

Business = require('../models/business.js');
Category = require('../models/category.js');

// Access control
const ensureAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()){
		console.log(req.isAuthenticated());
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
				business: business
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
				businesses: businesses
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
			categories: categories
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
		},
	});

	Business.addBusiness(newBusiness, (err, business) => {
		if(err){
			console.log(err);
		}
		res.redirect('/business');
	});
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
		console.log(business);
		res.render('review', {
			title: 'Write a review',
			business: business
		});	
	});
});

router.post('/write_review/submit/:id', ensureAuthenticated, (req, res, next) => {
	const queryId = {_id: req.params.id};
	const comment = {
		comment_author: req.body.name, 
		comment_title: req.body.title,
		comment_body: req.body.body,
		comment_stars: req.body.stars
	};

	Business.updateBusiness(queryId, {$push: {comments: comment}}, (err, comment) => {
		if(err){
			console.log(err);
		}
		res.redirect('/business');
	})
})
module.exports = router;
