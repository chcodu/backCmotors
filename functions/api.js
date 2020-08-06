const express = require('express');
const user_routes = require('./routes/user');
const company_routes = require('./routes/company');
const product_routes = require('./routes/products');
const app = express();
var bodyParser = require('body-parser');


// middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use('/api', user_routes);
app.use('/api', company_routes);
app.use('/api', product_routes);



module.exports = app;