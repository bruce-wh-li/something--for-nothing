const HttpError             = require('../api/helper/model/httpErrors');
const { validationResult }  = require('express-validator');
var defaultLog              = require('../logger');
const User                  = require('../api/helper/model/user');
var SECRET                  = process.env.SECRET || 'defaultSecret';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log('telllne',errors);
		throw new HttpError('Invalid inputs.', 422);
	}
	const { name, email, password } = req.body;
    
	let ifUserExist;
	try {
		ifUserExist = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Signing up failed.',500);
		defaultLog.errorLog.info('Error:', error);
		return next(error);
	}
    
	if (ifUserExist) {
		const error = new HttpError('Email already in our database, please login instead.',422);
		return next(error);
	}
    
	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError('Could not create user, please try again.',500);
		defaultLog.errorLog.info('Error:', error);
		return next(error);
	}


	const createdUser = new User({
		name,
		email,
		password:hashedPassword,
		items: []
	});
    
	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError('Signing up failed.',500);
		defaultLog.errorLog.info('Error:', err);
		return next(error);
	}
    
	let token;
	try {
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email },
			SECRET,
			{ expiresIn: '1h' }
		);
	} catch (err) {
		const error = new HttpError('Signing up failed, please try again later.',500);
		defaultLog.errorLog.info('Error:', err);
		return next(error);
	}

	res
		.status(201)
		.json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) =>{

	const { email, password } = req.body;

	let existingUser;

	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Logging in failed',500);
		defaultLog.errorLog.info('Error:', err);
		return next(error);
	}

	if (!existingUser ) {
		const error = new HttpError('You do not have account, sign up ',401);
		return next(error);
	}
    
	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (err) {
		const error = new HttpError('Could not log you in, please check your password.',500);
		defaultLog.errorLog.info('Error:', err);
		return next(error);
	}
  
	if (!isValidPassword) {
		const error = new HttpError('Invalid credentials, could not log you in.',403);
		return next(error);
	}
    
	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			SECRET,
			{ expiresIn: '1h' }
		);
	} catch (err) {
		const error = new HttpError('Logging in failed.',500);
		defaultLog.errorLog.info('Error:', err);
		return next(error);
	}

	res.json({
		userId: existingUser.id,
		email: existingUser.email,
		token: token
	});

};


exports.signup = signup;
exports.login = login;