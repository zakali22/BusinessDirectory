var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('business', {
  	title: 'Business Listing'
  });
});

router.get('/add', (req, res, next) => {
	res.render('addBusiness', {
		title: 'Add a business'
	})
});

module.exports = router;
