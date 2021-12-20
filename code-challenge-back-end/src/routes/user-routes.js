var express     = require('express');
var router      = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/user-controller');


router.post('/login', userController.login);
router.post('/signup', 
	[
		check('name')
			.not()
			.isEmpty(),
		check('email')
			.normalizeEmail() // Test@test.com => test@test.com
			.isEmail(),
		check('password').isLength({ min: 6 })
	],
	userController.signup);


module.exports = router;