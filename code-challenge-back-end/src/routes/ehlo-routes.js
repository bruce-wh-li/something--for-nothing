
var express     = require('express');
var router      = express.Router();
const defaultLog = require('../logger');

router.get(
	'/',
	(req, res) => {
		defaultLog.accessLog.info('API is running');
		return res.status(200).end();
	}
);

module.exports = router;
