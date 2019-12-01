var express = require('express');
var app = express();

var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'js')));

app.set('views','./views');
app.set('view engine','pug');

//insert routers here
var router = require('./app/router/router');
var apiRouter = require('./app/router/api_router');

//router mapping
app.use('/study6', router);
app.use('/api/study6', apiRouter);

app.listen(8080, () => {
	console.log('Server listening on port 8080');
});

