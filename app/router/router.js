var express = require('express');

var pagerRouter = express.Router();

pagerRouter.get('/',function(req,res) {
	res.render('pages/index', {
		title: 'Page Two',
		message: 'Page Two'
	})
})
module.exports = pagerRouter;