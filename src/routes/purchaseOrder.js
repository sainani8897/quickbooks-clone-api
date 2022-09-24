const express = require('express')
const purchaseOrderController = require('../controllers/purchaseOrder.controller')
const {purchaseOrderRules} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', purchaseOrderController.index);

router.post('/', purchaseOrderRules, purchaseOrderController.create);

router.get('/:id', purchaseOrderController.show);

router.patch('/', purchaseOrderRules,purchaseOrderController.update);

router.delete("/", purchaseOrderController.delete);

module.exports = router