const express = require('express')
const investmentController = require('../controllers/myInvestments.controller')
const {myInvestments} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', investmentController.index);

router.post('/',myInvestments, investmentController.create);

router.get('/:id', investmentController.show);

router.patch('/',myInvestments, investmentController.update);


module.exports = router