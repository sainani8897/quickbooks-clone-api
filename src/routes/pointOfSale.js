const express = require('express')
const pointOfSaleController = require('../controllers/pointOfSale.controller')
const {pointOfSale} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', pointOfSaleController.index);

router.post('/', pointOfSale, pointOfSaleController.create);

router.get('/:id', pointOfSaleController.show);

router.patch('/', pointOfSale,pointOfSaleController.update);

router.delete("/", pointOfSaleController.delete);

module.exports = router