var express = require('express');
var router = express.Router();

Business = require('../models/business.js');

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

router.get('/add', (req, res, next) => {
	res.render('addBusiness', {
		title: 'Add a business'
	});
});


router.post('/add', (req, res, next) => {
	const newBusiness = new Business({
		businessName: req.body.businessName,
		ownerName: req.body.ownerName,
		category: req.body.category,
		phone: req.body.phone,
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
