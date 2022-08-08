const express = require('express')
const productController = require('../controllers/product.controller')
const {myProducts} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', productController.index);

router.post('/', myProducts, productController.create);

router.get('/:id', productController.show);

router.patch('/', productController.update);

router.delete("/", productController.delete);

module.exports = router