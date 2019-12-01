const express = require('express');
const app = express();

var init = require('./router/crane-inspect-api-router');
intRouter = express.Router();
app.use('/v1/getAssets', init);

initRouter.get('/', function(req, res) {
    init.getAll(function(err, result) {
        if(err) {
            res.status(500).json({message: 'Error retrieving record!'});
            return;
        }
        res.status(200).json(result);
    });
});
