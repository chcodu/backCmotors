
const express = require('express');
const productController = require('../controllers/products');
var router = express();


router.post('/product/register', productController.saveProduct);
router.post('/product/getProducts', productController.getProducts);

module.exports = router;