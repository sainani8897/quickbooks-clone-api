const express = require('express')
const receivablesController = require('../controllers/receivables.controller')
const {receivableRules} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', receivablesController.index);

router.post('/', receivableRules, receivablesController.create);

router.get('/:id', receivablesController.show);

router.patch('/', receivableRules,receivablesController.update);

router.delete("/", receivablesController.delete);

module.exports = router