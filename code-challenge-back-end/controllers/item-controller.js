const fs = require('fs');
const { v4: uuidV4 } 		= require('uuid'); //has time stamp
const { validationResult } 	= require('express-validator');
const Item 					= require('../api/helper/model/item');
const User 					= require('../api/helper/model/user');
const HttpError 			= require('../api/helper/model/httpErrors');
const mongoose 				= require('mongoose');
var defaultLog    = require('../logger');






const getItemById = async (req, res, next) => {
	const itemId = req.params.itemID; 
	// console.log( 'fk you allll', itemId);
	let item;
	try {
		item = await Item.findById(itemId);
	} catch (err) {
		const error = new HttpError(
			'Error happened, could not find this item.',
			500
		);
		defaultLog.errorLog.info('Error:', err);
		return next(error);
	}
  
	if (!item) {
		const error = new HttpError('Could not find a place for the provided id.', 404);
		defaultLog.errorLog.info('Error:', error);
		return next(error);
	}

	res.json({ item: item.toObject( { getters : true } ) }); 
};

const createItem = async (req, res, next) =>{
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed.', 422)
		);
	}
	const {title, description, price, author} = req.body;
	const createNewItem = new Item({
		title,
		description,
		price,
		image: req.file.path,
		author
	});
	

	let user;
	try {
		user = await User.findById(author);
	} catch (err) {
		const error = new HttpError('Could not find user for provided id', 500);
		defaultLog.errorLog.info('Error:', err);
		return next(error);
	}
	if (!user) {
		const error = new HttpError('Could not find user for provided id', 404);
		return next(error);
	}
	// console.log('sadfsasadfafas', createNewItem);
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		await createNewItem.save({session: session});
		user.items.push(createNewItem);
		await user.save({ session: session });
		await session.commitTransaction();
	} catch (err) {
		
		const error = new HttpError('Creating fail',500);
		defaultLog.errorLog.info('Error:', err);
		return next(error);
	}

	res.status(201).json({item: createNewItem}); //201 for success reated new

};



const getItems = async (req, res, next) => {
	let items;
	try {
		items = await Item.find({}, );
	} catch (err) {
		const error = new HttpError('Fetching items failed.',500);
		defaultLog.errorLog.info('Error:', err);
		return next(error);
	}
	res.json({items: items.map(item => item.toObject({ getters: true }))});
};

const updateItemById = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed.', 422)
		);
	}
	const { description, price} = req.body; //only allow modify those two field
	const itemID = req.params.itemID;

	let updatedItem;
	try {
		updatedItem = await Item.findById(itemID);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not update place.',
			500
		);
		defaultLog.errorLog.info('Error:', error);
		return next(error);
	} 


	if (updatedItem.author.toString() !== req.userData.userId) {
		const error = new HttpError('Only owner can change or delete', 401);
		return next(error);
	} //only owner can change or delete

	updatedItem.description = description;
	updatedItem.price = price;

	
	try {
		await updatedItem.save();
	} catch (err) {
		const error = new HttpError('Error happened, could not update place.',500);
		defaultLog.errorLog.info('Error:', error);
		return next(error);
	}
	res.status(200).json({item: updatedItem});

};

const deleteItemById = async (req, res, next) =>{
	const itemID = req.params.itemID;

	let item;
	try {
		item = await Item.findById(itemID).populate('author');
	} catch (err) {
		const error = new HttpError('Error happened, could not delete place.',500);
		defaultLog.errorLog.info('Error:', error);
		return next(error);
	}
  
	if (!item) {
		const error = new HttpError('Could not find item for this id.', 404);
		defaultLog.errorLog.info('Error:', error);
		return next(error);
	}

	if (item.author.id !== req.userData.userId) {
		const error = new HttpError( 'Only owner can change or delete.', 401);
		return next(error);
	}

	const imagePath = item.image;
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		await item.remove({ session: session });
		item.author.items.pull(item);
		await item.author.save({ session: session });
		await session.commitTransaction();
	} catch (err) {
		const error = new HttpError('Error happened, failled to delete the place.',500 );
		defaultLog.errorLog.info('Error:', err);
		return next(error);
	}
	fs.unlink(imagePath, err=>{ //delete picture from db 
		defaultLog.errorLog.info('Error:', err);
	});//

	res.status(200).json({ message: 'Deleted place.' });
};

exports.getItemById = getItemById;
exports.createItem = createItem;
exports.getItems = getItems;
exports.updateItemById = updateItemById;
exports.deleteItem = deleteItemById;