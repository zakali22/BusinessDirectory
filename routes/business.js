var express = require('express');
var router = express.Router();

Business = require('../models/business.js');
Category = require('../models/category.js');
/* GET users listing. */
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
		console.log(business);
		res.render('business', {
			title: business.businessName,
			business: business
		})
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
		console.log(business);
		if(err){
			console.log(err);
		}
		res.redirect('/business');
	});
});
module.exports = router;
