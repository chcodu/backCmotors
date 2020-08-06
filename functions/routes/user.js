const express = require('express');
const userController = require('../controllers/user');

var router = express.Router();

router.get('/user/home', userController.home);
router.post('/user/login', userController.login);
router.post('/user/register', userController.saveUser);

module.exports = router;