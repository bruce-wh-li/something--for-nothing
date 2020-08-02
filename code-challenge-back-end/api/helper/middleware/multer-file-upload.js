const multer = require('multer');
const { v1: uuid } 		= require('uuid'); 

const MIME_TYPES = {
	'image/png': 'png',
	'image/jpeg': 'jpeg',
	'image/jpg': 'jpg'
};

const fileUpload = multer({
	limits: 700000,
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, 'uploads/images');
		},
		filename: (req, file, cb) => {
			const ext = MIME_TYPES[file.mimetype];
			cb(null, uuid() + '.' + ext);
		}
	}),
	fileFilter: (req, file, cb) => {
		const isValid = !!MIME_TYPES[file.mimetype]; //undefine null => false
		let error = isValid ? null : new Error('Invalid mime type!');
		cb(error, isValid);
	}
});

module.exports = fileUpload;
