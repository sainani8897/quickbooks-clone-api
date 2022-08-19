const express = require('express')
const investorController = require('../controllers/investor.controller')
const {myInvestments} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', investorController.index);

router.post('/', investorController.create);

router.get('/:id', investorController.show);

router.patch('/', investorController.update);

module.exports = router