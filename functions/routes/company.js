const express = require('express');
const companyController = require('../controllers/company');
var router = express.Router();


router.post('/company/register', companyController.registerCompany);
router.post('/company/getCompanies', companyController.getCompanies);


module.exports = router;