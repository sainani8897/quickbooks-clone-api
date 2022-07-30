const express = require('express')
const userController = require('../controllers/user.controller')
const {signup} = require('../middleware/validation-middleware');
/**
 * Router 
 */
let router = express.Router()

router.get('/', userController.index);

router.post('/',signup, userController.create);

router.get('/:slug', userController.show);

module.exports = router