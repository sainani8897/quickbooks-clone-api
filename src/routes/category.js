const express = require('express')
const categoryController = require('../controllers/category.controller')
const {myCategories} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', categoryController.index);

router.post('/', myCategories, categoryController.create);

router.get('/:id', categoryController.show);

router.patch('/', categoryController.update);

router.delete("/", categoryController.delete);

module.exports = router