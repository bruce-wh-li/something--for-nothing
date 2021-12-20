var express     = require('express');
var router      = express.Router();
const itemControllers = require('../controllers/item-controller');
const { check } = require('express-validator');
const fileUpload = require('../helper/middleware/multer-file-upload');
const checkAuth = require('../helper/middleware/check-auth');





router.get('/:itemID', itemControllers.getItemById);
router.get(
	'/',
	itemControllers.getItems
);

router.use(checkAuth); //need token for below router

router.post(
	'/newitem',
	fileUpload.single('image'),
	[
		check('title')
			.not()
			.isEmpty(),
		check('description').isLength({ min: 5 }),
	],
	itemControllers.createItem
);

router.patch('/:itemID',[
	check('description')
		.not()
		.isEmpty(),
	check('description').isLength({ min: 5 }),
], itemControllers.updateItemById);

router.delete('/:itemID', itemControllers.deleteItem);

module.exports = router;