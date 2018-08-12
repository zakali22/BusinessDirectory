var express = require('express');
var router = express.Router();

Category = require('../models/category.js');
Business = require('../models/business.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  Category.findCategories((err, categories) => {
  	if(err){
  		console.log(err);
  	}
  	categories.forEach((category) => {
  		const query = {category: category.title};
  		Business.findByCategory(query, (err, businesses) => {
  			const queryTitle = {title: category.title};
  			Category.findOneAndUpdate(queryTitle, {$set: {counter: businesses.length}}, (err, category) => {
  				console.log(category.counter);
  			});
  		});
  	});
  	res.render('categories', {
  		title: 'Business Categories',
  		categories: categories
  	})
  });
});



module.exports = router;
