const express = require('express')
const shipmentController = require('../controllers/shipment.controller')
const {shipmentRules} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', shipmentController.index);

router.post('/', shipmentRules, shipmentController.create);

router.get('/:id', shipmentController.show);

router.patch('/', shipmentRules,shipmentController.update);

router.delete("/", shipmentController.delete);

module.exports = router