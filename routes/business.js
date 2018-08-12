var express = require('express');
var router = express.Router();

Business = require('../models/business.js');
Category = require('../models/category.js');


router.get('/', function(req, res, next) {
	Business.findAllBusinesses((err, businesses) => {
		if(err){
			console.log(err);
		}
		res.render('businesses', {
	  		title: 'Business Listings',
	  		businesses: businesses
	  	});
	});
});

router.get('/show/:id', (req, res, next) => {
	const queryId = {_id: req.params.id};
	Business.findBusiness(queryId, (err, business) => {
		if(err){
			console.log(err);
		}
		res.render('business', {
			title: business.businessName,
			business: business
		})
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
module.exports = router;
