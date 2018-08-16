var express = require('express');
var router = express.Router();

// Access control
const ensureAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/user/login');
	}
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Business', isAuthenticated: req.isAuthenticated() });
});



module.exports = router;
