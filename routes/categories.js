var express = require('express');
var router = express.Router();

Category = require('../models/category.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  Category.findCategories((err, categories) => {
  	if(err){
  		console.log(err);
  	}
  	res.render('categories', {
  		title: 'Business Categories',
  		categories: categories
  	})
  });
});



module.exports = router;
